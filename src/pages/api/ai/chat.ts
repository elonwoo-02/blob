import type { APIRoute } from "astro";
import { AIMessage, HumanMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

type ChatRole = "system" | "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequest {
  messages?: ChatMessage[];
  threadId?: string;
  stream?: boolean;
}

const DEFAULT_MODEL = "gpt-4o-mini";
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;
const SYSTEM_PROMPT =
  "You are a concise and pragmatic technical assistant. Give accurate, actionable answers with clear steps.";

const jsonResponse = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const toBaseMessage = (message: ChatMessage): BaseMessage => {
  if (message.role === "assistant") return new AIMessage(message.content);
  if (message.role === "system") return new SystemMessage(message.content);
  return new HumanMessage(message.content);
};

const sanitizeMessages = (rawMessages: ChatMessage[] = []): ChatMessage[] =>
  rawMessages
    .filter((message) => {
      if (!message) return false;
      if (!["system", "user", "assistant"].includes(message.role)) return false;
      return typeof message.content === "string" && message.content.trim().length > 0;
    })
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_CHARS),
    }));

const extractText = (content: unknown): string => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          const textValue = (part as { text?: unknown }).text;
          return typeof textValue === "string" ? textValue : "";
        }
        return "";
      })
      .join("");
  }
  return "";
};

const parseQueryMessages = (request: Request): ChatMessage[] => {
  const url = new URL(request.url);
  let question = (url.searchParams.get("q") || "").trim();
  const rawHistory = url.searchParams.get("h") || "";
  let history: ChatMessage[] = [];

  if (rawHistory) {
    try {
      const parsed = JSON.parse(rawHistory) as ChatMessage[];
      history = sanitizeMessages(parsed);
    } catch {
      history = [];
    }
  }

  if (!question) {
    const lastUser = [...history].reverse().find((message) => message.role === "user");
    question = lastUser?.content?.trim() || "";
  }

  if (!question) return history;
  const shouldAppend =
    history.length === 0 ||
    history[history.length - 1].role !== "user" ||
    history[history.length - 1].content !== question;
  return sanitizeMessages(shouldAppend ? [...history, { role: "user", content: question }] : history);
};

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  const modelName = import.meta.env.OPENAI_MODEL || DEFAULT_MODEL;
  const baseUrl = import.meta.env.OPENAI_BASE_URL;

  if (!apiKey) {
    return jsonResponse(500, { error: "OPENAI_API_KEY is missing on server." });
  }

  const rawBody = await request.text();
  if (!rawBody.trim()) {
    return jsonResponse(400, { error: "Request body is empty." });
  }

  let body: ChatRequest;
  try {
    body = JSON.parse(rawBody) as ChatRequest;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON payload." });
  }

  const messages = sanitizeMessages(body.messages);
  if (!messages.length) {
    return jsonResponse(400, { error: "messages is required and cannot be empty." });
  }

  const model = new ChatOpenAI({
    apiKey,
    model: modelName,
    configuration: baseUrl ? { baseURL: baseUrl } : undefined,
  });

  const graph = new StateGraph(MessagesAnnotation)
    .addNode("assistant", async (state) => {
      const response = await model.invoke([new SystemMessage(SYSTEM_PROMPT), ...state.messages]);
      return { messages: [response] };
    })
    .addEdge(START, "assistant")
    .addEdge("assistant", END)
    .compile();

  const inputMessages = messages.map(toBaseMessage);

  if (!body.stream) {
    try {
      const result = await graph.invoke({ messages: inputMessages });
      const outputMessages = result.messages ?? [];
      const lastMessage = outputMessages[outputMessages.length - 1];
      const text = extractText((lastMessage as { content?: unknown })?.content);
      return jsonResponse(200, { text });
    } catch {
      return jsonResponse(500, { error: "Failed to generate assistant response." });
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        let fullText = "";
        for await (const chunk of (graph as any).stream(
          { messages: inputMessages },
          { streamMode: "messages" },
        )) {
          const messageLike = Array.isArray(chunk) ? chunk[0] : chunk;
          const text = extractText((messageLike as { content?: unknown })?.content);
          if (!text) continue;
          fullText += text;
          sendEvent("token", { text });
        }

        if (!fullText) {
          const fallback = await graph.invoke({ messages: inputMessages });
          const outputMessages = fallback.messages ?? [];
          const lastMessage = outputMessages[outputMessages.length - 1];
          const text = extractText((lastMessage as { content?: unknown })?.content);
          if (text) {
            fullText = text;
            sendEvent("token", { text });
          }
        }

        sendEvent("done", { ok: true });
        controller.close();
      } catch {
        try {
          const fallback = await graph.invoke({ messages: inputMessages });
          const outputMessages = fallback.messages ?? [];
          const lastMessage = outputMessages[outputMessages.length - 1];
          const text = extractText((lastMessage as { content?: unknown })?.content);
          if (text) {
            sendEvent("token", { text });
            sendEvent("done", { ok: true, fallback: "invoke" });
            controller.close();
            return;
          }
        } catch {
          // ignore fallback failure and return stream error below
        }
        sendEvent("error", { message: "Failed to stream assistant response." });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
};

export const GET: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  const modelName = import.meta.env.OPENAI_MODEL || DEFAULT_MODEL;
  const baseUrl = import.meta.env.OPENAI_BASE_URL;
  const messages = parseQueryMessages(request);

  if (!apiKey) return jsonResponse(500, { error: "OPENAI_API_KEY is missing on server." });
  if (!messages.length) {
    return jsonResponse(400, { error: "Missing question in query params/history." });
  }

  const model = new ChatOpenAI({
    apiKey,
    model: modelName,
    configuration: baseUrl ? { baseURL: baseUrl } : undefined,
  });

  const graph = new StateGraph(MessagesAnnotation)
    .addNode("assistant", async (state) => {
      const response = await model.invoke([new SystemMessage(SYSTEM_PROMPT), ...state.messages]);
      return { messages: [response] };
    })
    .addEdge(START, "assistant")
    .addEdge("assistant", END)
    .compile();

  const inputMessages = messages.map(toBaseMessage);
  try {
    const result = await graph.invoke({ messages: inputMessages });
    const outputMessages = result.messages ?? [];
    const lastMessage = outputMessages[outputMessages.length - 1];
    const text = extractText((lastMessage as { content?: unknown })?.content);
    return jsonResponse(200, { text });
  } catch {
    return jsonResponse(500, { error: "Failed to generate assistant response." });
  }
};
