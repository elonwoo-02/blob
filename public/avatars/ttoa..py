from PIL import Image


def image_to_ascii(image_path, new_width=100):
    # 1. 定义字符映射表（按密度从小到大）
    # 图二效果细腻，可以增加字符梯度
    ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@", '\\', '|', '/', '(', ')', '[', ']', '{', '}', '<', '>']

    try:
        img = Image.open(image_path)
    except Exception as e:
        return f"无法打开图片: {e}"

    # 2. 调整尺寸并修正宽高比 (字符高度约为宽度的2倍)
    width, height = img.size
    aspect_ratio = height / width
    new_height = int(new_width * aspect_ratio * 0.5)
    img = img.resize((new_width, new_height))

    # 3. 灰度化
    img = img.convert("L")

    # 4. 像素映射到字符
    pixels = img.getdata()
    characters = "".join([ASCII_CHARS[pixel // 26] for pixel in pixels])

    # 5. 拼接成最终字符串
    pixel_count = len(characters)
    ascii_image = "\n".join([characters[index:(index + new_width)] for index in range(0, pixel_count, new_width)])

    return ascii_image

# 使用方法
print(image_to_ascii("./default.png", new_width=120))