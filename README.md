# Project Populator

**The Drag & Drop Killer** — an After Effects ScriptUI panel for building and populating photo slideshow projects without touching a single layer manually.

---

## Overview

Project Populator is a dockable After Effects panel that handles the full lifecycle of a photo slideshow template in three steps:

1. **Build** — Generate any number of pre-comps with placeholder solids in one click
2. **Populate** — Point to a folder of JPGs and automatically replace every placeholder with a photo, scaled to fill
3. **Replace** — Swap out photos in an already-animated project without touching a single keyframe

---

## Installation

### As a Dockable Panel (Recommended)

1. Copy `Project Populator.jsx` to your After Effects ScriptUI Panels folder:
   - **Mac:** `/Applications/Adobe After Effects [version]/Scripts/ScriptUI Panels/`
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\ScriptUI Panels\`
2. Restart After Effects
3. Go to **Window** menu — `Project Populator` will appear at the bottom of the list
4. Dock it anywhere in your workspace like any other panel


> **Note:** Go to **Edit > Preferences > Scripting & Expressions** and enable **"Allow Scripts to Write Files and Access Network"** before running.

---

## Features

### 01 — Build Project

Set up a full slideshow template from scratch.

| Setting | Description |
|---|---|
| Number of comps | How many pre-comps to generate |
| Width / Height | Comp dimensions in pixels |
| Duration | Comp length in seconds |
| Frame rate | FPS for all generated comps |
| Pre-comp prefix | Naming prefix for comps (e.g. `Comp_` → `Comp_001`) |
| Placeholder prefix | Naming prefix for solid layers (e.g. `placeholder_` → `placeholder_001`) |
| Randomize colors | Give each placeholder solid a unique random color |

Clicking **Build Project** creates the following structure in your AE project:

```
Pre_Comps/              ← folder created automatically
├── Comp_001
│     └── placeholder_001   (solid, sized to comp)
├── Comp_002
│     └── placeholder_002
└── Comp_003
      └── placeholder_00N
```

- Pre-comps are automatically placed in a `Pre_Comps` folder
- Safe to rerun — existing comps are skipped, not overwritten
- Fully undoable with `Ctrl/Cmd+Z`

---

### 02 — Populate

Replace placeholder solids with real photos from a folder.

1. Click **Browse** and select a folder of JPG images
2. The panel shows a live count of images found
3. Click **Populate**

Each image is matched to its corresponding pre-comp by index order (first image → `Comp_001`, second → `Comp_002`, etc.) and:

- Replaces the placeholder solid layer with the imported photo
- Scales the photo to **fill** the comp (cover mode — no letterboxing)
- Centers the photo in the comp
- Imported files are automatically organized into a `Your_Files` folder in the project panel

**Mismatch handling:**
- More images than comps → warning dialog, option to proceed with available comps or cancel
- Fewer images than comps → result shows how many comps were left unpopulated and how many images to add before rerunning

---

### 03 — Replace Existing

Swap photos in a project that's already been animated. All keyframes, effects, and transforms are preserved — only the source footage is replaced.

**Two targeting modes:**

| Mode | How it works |
|---|---|
| By Prefix | Targets all comps whose names start with the specified prefix, sorted alphabetically |
| By Selection | Select any comps in the Project panel (Ctrl/Cmd+click for multiple), then run Replace |

The **By Selection** mode is ideal when comp names don't follow a consistent convention — just click what you want to update.

The script finds the **first non-solid footage layer** in each comp and replaces it. If none is found it falls back to the first layer with any source. Replaced photos are scaled to fill and centered, same as Populate.

---

## Project Structure

After a full Build + Populate run, your AE project panel looks like this:

```
Project
├── Pre_Comps/
│     ├── Comp_001
│     ├── Comp_002
│     └── Comp_003
├── Your_Files/
│     ├── photo_01.jpg
│     ├── photo_02.jpg
│     └── photo_0N.jpg
└── Main Comp
      ├── Comp_001  (as layer)
      ├── Comp_002  (as layer)
      └── Comp_00N  (as layer)
```

---

## Requirements

- Adobe After Effects CC 2014 or later
- Scripting & Expressions preference: **Allow Scripts to Write Files and Access Network** must be enabled


---

## Notes

- The script is **fully self-contained** — no external files or dependencies required
- All operations are undoable (`Ctrl/Cmd+Z`)
- Naming conventions are fully customizable — the prefixes `Comp_` and `placeholder_` are defaults, not requirements
- The `Pre_Comps` and `Your_Files` folders are created automatically and reused on subsequent runs — no duplicates
- use any type file: JPG, PNG, MOV, Mp4, etc

---

## License

License key required

---

*Built with ExtendScript for Adobe After Effects.*
