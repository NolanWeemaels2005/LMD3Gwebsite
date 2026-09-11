"""Usage: python scripts/optimize-assets.py /path/to/extracted/images
Requires Pillow and pillow-heif. Photography is EXIF-oriented, stripped of metadata,
resized without upscaling, and saved at quality 83 in responsive WebP variants.
"""
from pathlib import Path
import sys
from PIL import Image, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()
source = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
output = root / 'src/assets/images'
output.mkdir(parents=True, exist_ok=True)
for path in sorted((source / 'Images for website').iterdir()):
    if path.suffix.lower() not in {'.jpg', '.heic'}:
        continue
    image = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    name = path.stem.lower()
    for width in ([960, 1920, 2404] if name == 'hero-home' else [480, 960]):
        variant = image.copy()
        variant.thumbnail((width, round(image.height * width / image.width)))
        variant.save(output / f'{name}-{width}.webp', 'WEBP', quality=83, method=6)
