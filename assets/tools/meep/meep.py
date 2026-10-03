#!/usr/bin/env python3
"""Meep - small floating creature.
Built from the reference art: round golden head, two large cream almond eyes
outlined in red with a small curl above each, a dark underside shade band,
a tapering neck into a rounded body, two small rounded feet at the base.
Two frames for a subtle idle float (body bob 1px), no walk cycle - it hovers
beside the player rather than walking.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, "E:/dev/retro-dev-journey/.claude/skills/pixel-assets/scripts")
from pixelkit import Canvas

GOLD_LIGHT = "#f4c252"
GOLD_BASE = "#eda824"
GOLD_DARK = "#c6841a"
BODY_DARK = "#e8961f"
EYE_WHITE = "#fdf3d6"
RED = "#d1502e"
OUTLINE = "#4a2e12"

def draw(bob):
    C = Canvas(32, 32, scale=4)
    b = bob  # 0 or 1, shifts the whole creature up by 1px on the "up" frame

    # body (rounded, tapering from neck)
    C.ellipse(12, 19 - b, 20, 27 - b, BODY_DARK)
    C.ellipse(12, 18 - b, 20, 25 - b, GOLD_BASE)
    # neck taper
    C.polygon([(13, 15 - b), (19, 15 - b), (18, 20 - b), (14, 20 - b)], GOLD_BASE)
    # two small rounded feet, split by a notch
    C.ellipse(12, 26 - b, 16, 30 - b, GOLD_DARK)
    C.ellipse(16, 26 - b, 20, 30 - b, GOLD_DARK)
    C.rect(15, 27 - b, 17, 30 - b, (0, 0, 0, 0))  # notch (cleared below via redraw order)

    # head: dark base then lighter ellipse to fake a lit sphere - all centred
    # on x=16 so left/right eyes and curls land symmetrically
    C.ellipse(6, 2 - b, 26, 18 - b, GOLD_DARK)
    C.ellipse(7, 1 - b, 25, 16 - b, GOLD_BASE)
    C.ellipse(8, 0 - b, 24, 14 - b, GOLD_LIGHT)
    # underside shade band (chin), reasserts the dark tone at the base of the head
    C.ellipse(9, 12 - b, 23, 17 - b, GOLD_DARK)
    C.ellipse(9, 12 - b, 23, 15 - b, GOLD_BASE)

    # eyes: large cream almonds, left and right, red outline + curl above
    for side in (-1, 1):
        ex = 16 + side * 6
        C.ellipse(ex - 3, 6 - b, ex + 3, 12 - b, EYE_WHITE)
    C.outline(OUTLINE)  # lock silhouette before adding thin red linework on top

    # red eye outlines + curls (drawn after outline so they sit on the face, not the edge)
    for side in (-1, 1):
        ex = 16 + side * 6
        C.d.ellipse([ex - 3, 6 - b, ex + 3, 12 - b], outline=RED)
        # small curl above the eye
        C.d.arc([ex - 2, 2 - b, ex + 2, 6 - b], 180, 360, fill=RED)
    # thin connecting arc beneath both eyes (bridge of the "nose")
    C.d.arc([11, 9 - b, 21, 15 - b], 20, 160, fill=RED)

    return C

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../frontend/public/sprites/story/companion/meep")
    os.makedirs(out_dir, exist_ok=True)
    f0 = draw(0)
    f1 = draw(1)
    f0.save(f"{out_dir}/meep_idle_0.png", preview=os.path.join(os.path.dirname(os.path.abspath(__file__)), "_preview_meep_0.png"))
    f1.save(f"{out_dir}/meep_idle_1.png", preview=os.path.join(os.path.dirname(os.path.abspath(__file__)), "_preview_meep_1.png"))
    print("saved")
