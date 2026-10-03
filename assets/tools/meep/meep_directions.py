#!/usr/bin/env python3
"""Meep in 8 directions, built from the reference photos (see reference/meep):
  S  front view (meep.py draw())         - reference 4 (frontal) / idle sprite
  E  three-quarter / profile view        - reference 1 and 3
  N  back view (plain head, seam, feet)  - reference 2
  W  E mirrored
  SE/SW  front view shifted sideways     - derived, not a separate reference
  NE/NW  back view shifted sideways      - derived, not a separate reference
Two frames per direction (1px float), same palette and 4x scale as meep.py.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, "E:/dev/retro-dev-journey/.claude/skills/pixel-assets/scripts")
from PIL import Image, ImageDraw
from pixelkit import Canvas
import meep as meep_base

GOLD_LIGHT = "#f4c252"
GOLD_BASE = "#eda824"
GOLD_DARK = "#c6841a"
BODY_DARK = "#e8961f"
EYE_WHITE = "#fdf3d6"
RED = "#d1502e"
OUTLINE = "#4a2e12"


def body_and_feet(C, b):
    C.ellipse(12, 19 - b, 20, 27 - b, BODY_DARK)
    C.ellipse(12, 18 - b, 20, 25 - b, GOLD_BASE)
    C.polygon([(13, 15 - b), (19, 15 - b), (18, 20 - b), (14, 20 - b)], GOLD_BASE)
    C.ellipse(12, 26 - b, 16, 30 - b, GOLD_DARK)
    C.ellipse(16, 26 - b, 20, 30 - b, GOLD_DARK)
    C.rect(15, 27 - b, 17, 30 - b, (0, 0, 0, 0))


def head(C, b):
    C.ellipse(6, 2 - b, 26, 18 - b, GOLD_DARK)
    C.ellipse(7, 1 - b, 25, 16 - b, GOLD_BASE)
    C.ellipse(8, 0 - b, 24, 14 - b, GOLD_LIGHT)
    C.ellipse(9, 12 - b, 23, 17 - b, GOLD_DARK)
    C.ellipse(9, 12 - b, 23, 15 - b, GOLD_BASE)


def back_frame(b):
    C = Canvas(32, 32, scale=4)
    body_and_feet(C, b)
    head(C, b)
    C.d.line([(16, 2 - b), (16, 15 - b)], fill=GOLD_DARK)  # plush seam, centre back
    C.outline(OUTLINE)
    return C


def profile_frame(b, side):
    """side=+1 eye on the right, side=-1 eye on the left (mirror)."""
    C = Canvas(32, 32, scale=4)
    body_and_feet(C, b)
    head(C, b)
    ex = 16 + side * 6
    C.ellipse(ex - 3, 6 - b, ex + 3, 12 - b, EYE_WHITE)
    C.outline(OUTLINE)
    C.d.ellipse([ex - 3, 6 - b, ex + 3, 12 - b], outline=RED)
    C.d.arc([ex - 2, 2 - b, ex + 2, 6 - b], 180, 360, fill=RED)
    return C


def native(C):
    return C.im.copy()


def shifted(img, dx):
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, (dx, 0), img)
    return out


def mirrored(img):
    return img.transpose(Image.FLIP_LEFT_RIGHT)


def frames_for(direction):
    if direction == "S":
        return [native(meep_base.draw(bob)) for bob in (0, 1)]
    if direction == "N":
        return [native(back_frame(bob)) for bob in (0, 1)]
    if direction == "E":
        return [native(profile_frame(bob, +1)) for bob in (0, 1)]
    if direction == "W":
        return [mirrored(native(profile_frame(bob, +1))) for bob in (0, 1)]
    if direction == "SE":
        return [shifted(native(meep_base.draw(bob)), 2) for bob in (0, 1)]
    if direction == "SW":
        return [shifted(native(meep_base.draw(bob)), -2) for bob in (0, 1)]
    if direction == "NE":
        return [shifted(native(back_frame(bob)), 2) for bob in (0, 1)]
    if direction == "NW":
        return [shifted(native(back_frame(bob)), -2) for bob in (0, 1)]
    raise ValueError(direction)


def to_gif(frames, path):
    big = [f.resize((128, 128), Image.NEAREST) for f in frames]
    pal = []
    for f in big:
        for p in f.getdata():
            if p[3] and p[:3] not in pal:
                pal.append(p[:3])
    flat = [v for c in [(0, 0, 0)] + pal for v in c] + [0] * (768 - 3 * (len(pal) + 1))
    idx = {c: i + 1 for i, c in enumerate(pal)}
    pals = []
    for f in big:
        q = Image.new("P", f.size)
        q.putpalette(flat)
        q.putdata([idx[p[:3]] if p[3] else 0 for p in f.getdata()])
        pals.append(q)
    pals[0].save(path, save_all=True, append_images=pals[1:], duration=260, loop=0, transparency=0, disposal=2)


if __name__ == "__main__":
    # The game serves the sprites from frontend/public; this script lives in assets/tools/meep.
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../frontend/public/sprites/story/companion/meep")
    for d in ["S", "SE", "E", "NE", "N", "NW", "W", "SW"]:
        path = os.path.join(out_dir, f"meep_{d}.gif")
        to_gif(frames_for(d), path)
        print(path)
