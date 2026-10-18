"""把整個 App 合併成單一 HTML 檔（用於 Claude 線上預覽或傳給朋友）。
用法：python3 tools/build-preview.py  →  產生 dist/western-kitchen.html"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root/"index.html").read_text(encoding="utf-8")
fonts = re.search(r"<!--FONTS-->(.*?)<!--/FONTS-->", html, re.S).group(1).strip()
body = re.search(r"<!--BODY-->(.*?)<!--/BODY-->", html, re.S).group(1).strip()
scripts = re.findall(r'<script src="([^"]+)"></script>', re.search(r"<!--SCRIPTS-->(.*?)<!--/SCRIPTS-->", html, re.S).group(1))
css = (root/"css/style.css").read_text(encoding="utf-8")
js = "\n".join((root/s).read_text(encoding="utf-8") for s in scripts)
out = f"""<title>西餐練習簿</title>
<meta name="claude:viewport-fit-sides" content="cover">
{fonts}
<style>
{css}
</style>
{body}
<script>
{js}
</script>
"""
(root/"dist").mkdir(exist_ok=True)
(root/"dist/western-kitchen.html").write_text(out, encoding="utf-8")
print("dist/western-kitchen.html", len(out)//1024, "KB")
