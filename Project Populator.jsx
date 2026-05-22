// ============================================================
//  Project Populator.jsx
//
//  STEP 1 — BUILD PROJECT
//    Set comp count, size, fps, duration, and naming.
//    Creates pre-comps with cream solid placeholders.
//
//  STEP 2 — POPULATE
//    Point to a folder of JPGs. Replaces placeholders,
//    scales each photo to fill the comp (cover mode).
//
//  INSTALL (dockable panel):
//    Copy to: Scripts/ScriptUI Panels/  then restart AE.
//    Access via the Window menu.
//
//  OR run directly via: File > Scripts > Run Script File...
// ============================================================

(function ProjectPopulator(thisObj) {

    // ── PALETTE ──────────────────────────────────────────────
    var C = {
        bg:        [0.110, 0.122, 0.137],   // darkest bg
        header:    [0.094, 0.106, 0.118],   // header bar
        section:   [0.149, 0.165, 0.184],   // section bg
        row:       [0.133, 0.149, 0.165],   // input row bg
        accent:    [0.380, 0.698, 0.788],   // sky teal
        btnBuild:  [0.220, 0.490, 0.580],   // build btn
        btnPop:    [0.235, 0.576, 0.416],   // populate btn
        warn:      [0.820, 0.529, 0.220],   // amber
        textWht:   [0.961, 0.965, 0.969],   // near white
        textMid:   [0.588, 0.627, 0.671],   // mid grey
        textDim:   [0.337, 0.369, 0.404],   // dim
        cream:     [0.961, 0.941, 0.902],   // placeholder solid
    };

    // ── WINDOW ───────────────────────────────────────────────
    var win = (thisObj instanceof Panel)
        ? thisObj
        : new Window("palette", "Project Populator", undefined, { resizeable: true });

    win.margins     = 0;
    win.spacing     = 0;
    win.orientation = "column";
    win.preferredSize.width = 320;

    function setBg(el, col) {
        el.graphics.backgroundColor = el.graphics.newBrush(
            el.graphics.BrushType.SOLID_COLOR, col);
    }
    function setFg(el, col) {
        el.graphics.foregroundColor = el.graphics.newPen(
            el.graphics.PenType.SOLID_COLOR, col, 1);
    }
    function setFont(el, name, style, size) {
        el.graphics.font = ScriptUI.newFont(name, style, size);
    }

    setBg(win, C.bg);

    // ── HEADER ───────────────────────────────────────────────
    var hdr = win.add("group");
    hdr.orientation = "column";
    hdr.alignment   = ["fill", "top"];
    hdr.margins     = [14, 10, 14, 10];
    hdr.spacing     = 0;
    setBg(hdr, C.header);

    // ── Logo — Base64 encoded PNG (no external file needed) ──
    var logoB64 = "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";

    // Write PNG to a temp file so ScriptUI can load it as an image
    var tmpLogo = new File(Folder.temp.fsName + "/pp_logo_tmp.png");
    tmpLogo.open("w", "????", "????");
    tmpLogo.encoding = "BINARY";

    // Decode base64 → binary
    var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var logoBytes = "";
    var cleanB64  = logoB64;
    for (var bi = 0; bi < cleanB64.length; bi += 4) {
        var c0 = b64chars.indexOf(cleanB64.charAt(bi));
        var c1 = b64chars.indexOf(cleanB64.charAt(bi + 1));
        var c2 = b64chars.indexOf(cleanB64.charAt(bi + 2));
        var c3 = b64chars.indexOf(cleanB64.charAt(bi + 3));
        if (c0 < 0 || c1 < 0) continue;
        logoBytes += String.fromCharCode((c0 << 2) | (c1 >> 4));
        if (c2 >= 0) logoBytes += String.fromCharCode(((c1 & 15) << 4) | (c2 >> 2));
        if (c3 >= 0) logoBytes += String.fromCharCode(((c2 & 3) << 6) | c3);
    }
    tmpLogo.write(logoBytes);
    tmpLogo.close();

    var logoImg = hdr.add("image", undefined, tmpLogo);
    logoImg.alignment = ["center", "center"];
    logoImg.preferredSize = [260, 104];

    // ── HELPER: section wrapper ───────────────────────────────
    function makeSection(parent, label) {
        // Section label bar
        var labelBar = parent.add("group");
        labelBar.orientation = "row";
        labelBar.alignment   = ["fill", "top"];
        labelBar.margins     = [14, 6, 14, 4];
        labelBar.spacing     = 6;
        setBg(labelBar, C.bg);

        var dot = labelBar.add("statictext", undefined, "▸");
        setFont(dot, "Tahoma", "Bold", 10);
        setFg(dot, C.accent);

        var lbl = labelBar.add("statictext", undefined, label);
        setFont(lbl, "Tahoma", "Bold", 10);
        setFg(lbl, C.accent);

        // Section content group
        var sec = parent.add("group");
        sec.orientation = "column";
        sec.alignment   = ["fill", "top"];
        sec.margins     = [14, 8, 14, 10];
        sec.spacing     = 6;
        setBg(sec, C.section);

        return sec;
    }

    // ── HELPER: field row (label + input) ────────────────────
    function makeField(parent, labelText, defaultVal, inputW) {
        var row = parent.add("group");
        row.orientation = "row";
        row.alignment   = ["fill", "top"];
        row.margins     = 0;
        row.spacing     = 0;

        var lbl = row.add("statictext", undefined, labelText);
        lbl.alignment = ["left", "center"];
        lbl.preferredSize.width = 148;
        setFont(lbl, "Tahoma", "Regular", 10);
        setFg(lbl, C.textMid);

        var inp = row.add("edittext", undefined, String(defaultVal));
        inp.alignment = ["right", "center"];
        inp.preferredSize = [inputW || 80, 20];
        setFont(inp, "Tahoma", "Bold", 10);
        // No custom bg/fg on edittext — avoids the black border issue
        return inp;
    }

    // ── HELPER: big button ────────────────────────────────────
    function makeBtn(parent, label, h) {
        var btn = parent.add("button", undefined, label);
        btn.alignment = ["fill", "top"];
        btn.preferredSize.height = h || 32;
        setFont(btn, "Tahoma", "Bold", 11);
        return btn;
    }

    // ── HELPER: hint text ─────────────────────────────────────
    function makeHint(parent, text) {
        var h = parent.add("statictext", undefined, text);
        setFont(h, "Tahoma", "Regular", 8);
        setFg(h, C.textDim);
        h.alignment = ["fill", "top"];
        return h;
    }

    // ── HELPER: zero-pad number ───────────────────────────────
    function pad(n) {
        if (n < 10)  return "00" + n;
        if (n < 100) return "0"  + n;
        return "" + n;
    }

    // ════════════════════════════════════════════════════════
    //  SECTION 1 — BUILD PROJECT
    // ════════════════════════════════════════════════════════
    var sec1 = makeSection(win, "01  BUILD PROJECT");

    var compCountInp = makeField(sec1, "Number of comps", "5", 60);
    var compWInp     = makeField(sec1, "Width (px)", "1920", 60);
    var compHInp     = makeField(sec1, "Height (px)", "1080", 60);
    var compDurInp   = makeField(sec1, "Duration (seconds)", "5", 60);
    var compFPSInp   = makeField(sec1, "Frame rate (fps)", "24", 60);

    // Spacer line
    var sp1 = sec1.add("panel"); sp1.alignment = ["fill","top"]; sp1.preferredSize.height = 1; sp1.margins = 0;

    var compPfxInp   = makeField(sec1, "Pre-comp prefix", "Comp_", 100);
    var layerPfxInp  = makeField(sec1, "Placeholder prefix", "placeholder_", 100);
    makeHint(sec1, "Result:  Comp_001  contains  placeholder_001");

    // ── Color Randomizer ─────────────────────────────────────
    var colorRow = sec1.add("group");
    colorRow.orientation = "row";
    colorRow.alignment   = ["fill", "top"];
    colorRow.margins     = [0, 2, 0, 0];
    colorRow.spacing     = 8;

    var randomizeChk = colorRow.add("checkbox", undefined, "Randomize placeholder colors");
    setFont(randomizeChk, "Tahoma", "Bold", 10);
    setFg(randomizeChk, C.textMid);
    randomizeChk.value = false;

    var buildBtn = makeBtn(sec1, "BUILD PROJECT", 28);

    // ════════════════════════════════════════════════════════
    //  SECTION 2 — POPULATE
    // ════════════════════════════════════════════════════════
    var sec2 = makeSection(win, "02  POPULATE");

    // Folder row
    var folderGroup = sec2.add("group");
    folderGroup.orientation = "column";
    folderGroup.alignment   = ["fill", "top"];
    folderGroup.margins     = 0;
    folderGroup.spacing     = 5;

    var folderTopRow = folderGroup.add("group");
    folderTopRow.orientation = "row";
    folderTopRow.alignment   = ["fill", "top"];
    folderTopRow.margins     = 0;
    folderTopRow.spacing     = 6;

    var folderLbl = folderTopRow.add("statictext", undefined, "WATCH FOLDER");
    setFont(folderLbl, "Tahoma", "Bold", 9);
    setFg(folderLbl, C.textMid);
    folderLbl.alignment = ["left", "center"];

    var browseBtn = folderTopRow.add("button", undefined, "BROWSE...");
    browseBtn.alignment = ["right", "center"];
    browseBtn.preferredSize = [80, 20];
    setFont(browseBtn, "Tahoma", "Bold", 9);

    var folderPathLbl = folderGroup.add("statictext", undefined, "No folder selected", { truncate: "middle" });
    folderPathLbl.alignment = ["fill", "top"];
    setFont(folderPathLbl, "Tahoma", "Regular", 9);
    setFg(folderPathLbl, C.textDim);

    var fileCountLbl = folderGroup.add("statictext", undefined, "");
    setFont(fileCountLbl, "Tahoma", "Bold", 9);
    setFg(fileCountLbl, C.textDim);

    var populateBtn = makeBtn(sec2, "POPULATE", 30);
    setFont(populateBtn, "Tahoma", "Bold", 13);

    // ════════════════════════════════════════════════════════
    //  STATE
    // ════════════════════════════════════════════════════════
    var watchFolder = null;

    // ════════════════════════════════════════════════════════
    //  BROWSE HANDLER
    // ════════════════════════════════════════════════════════
    browseBtn.onClick = function () {
        var f = Folder.selectDialog("Select your Watch Folder of photos:");
        if (!f) return;
        watchFolder = f;

        var p = f.fsName;
        folderPathLbl.text = p.length > 42 ? "..." + p.slice(-39) : p;
        setFg(folderPathLbl, C.textMid);

        var jpgs = f.getFiles("*.jpg").concat(f.getFiles("*.jpeg"));
        var n    = jpgs.length;
        fileCountLbl.text = n + " JPG" + (n !== 1 ? "s" : "") + " found";
        setFg(fileCountLbl, n > 0 ? C.btnPop : C.warn);
    };

    // ════════════════════════════════════════════════════════
    //  BUILD PROJECT HANDLER
    // ════════════════════════════════════════════════════════
    buildBtn.onClick = function () {

        var numComps = parseInt(compCountInp.text, 10);
        var compW    = parseInt(compWInp.text, 10);
        var compH    = parseInt(compHInp.text, 10);
        var compDur  = parseFloat(compDurInp.text);
        var compFPS  = parseFloat(compFPSInp.text);
        var compPfx  = compPfxInp.text;
        var layerPfx = layerPfxInp.text;

        if (isNaN(numComps) || numComps < 1) { alert("Enter a valid number of comps."); return; }
        if (isNaN(compW) || isNaN(compH))    { alert("Enter valid width and height."); return; }
        if (isNaN(compDur) || compDur <= 0)  { alert("Enter a valid duration."); return; }
        if (isNaN(compFPS) || compFPS <= 0)  { alert("Enter a valid frame rate."); return; }
        if (!compPfx || !layerPfx)           { alert("Enter naming prefixes."); return; }

        // Cream solid color (RGB 0-1)
        // Solid color — cream default or randomized per comp
        var useRandom = randomizeChk.value;
        var solidColor = [0.961, 0.941, 0.902]; // cream default

        app.beginUndoGroup("Project Populator: Build");

        var created = 0;
        var skipped = 0;

        // ── Get or create the Pre_Comps folder ───────────────
        var preCompsFolder = null;
        for (var f = 1; f <= app.project.numItems; f++) {
            if (app.project.item(f) instanceof FolderItem &&
                app.project.item(f).name === "Pre_Comps") {
                preCompsFolder = app.project.item(f);
                break;
            }
        }
        if (!preCompsFolder) {
            preCompsFolder = app.project.items.addFolder("Pre_Comps");
        }

        for (var i = 1; i <= numComps; i++) {
            var p        = pad(i);
            var compName = compPfx  + p;
            var layName  = layerPfx + p;

            // Check if comp already exists — skip if so
            var exists = false;
            for (var k = 1; k <= app.project.numItems; k++) {
                if (app.project.item(k) instanceof CompItem &&
                    app.project.item(k).name === compName) {
                    exists = true;
                    break;
                }
            }
            if (exists) { skipped++; continue; }

            // Create the comp
            var newComp = app.project.items.addComp(
                compName, compW, compH, 1, compDur, compFPS
            );

            // Move comp into Pre_Comps folder
            newComp.parentFolder = preCompsFolder;

            // layers.addSolid() creates a solid directly in the comp
            // and bypasses AE's project-level solid deduplication,
            // which caused app.project.items.addSolid to return the
            // same FootageItem every iteration and break the loop.
            // Pick color for this comp
            var thisColor = solidColor;
            if (useRandom) {
                thisColor = [
                    Math.random() * 0.85 + 0.15,
                    Math.random() * 0.85 + 0.15,
                    Math.random() * 0.85 + 0.15
                ];
            }

            var solidLayer = newComp.layers.addSolid(
                thisColor, layName, compW, compH, 1
            );
            solidLayer.inPoint  = 0;
            solidLayer.outPoint = compDur;

            created++;
        }

        app.endUndoGroup();

        var msg = "Built " + created + " comp" + (created !== 1 ? "s" : "") + ".";
        if (skipped > 0) msg += "\n" + skipped + " already existed and were skipped.";
        alert(msg);
    };

    // ════════════════════════════════════════════════════════
    //  POPULATE HANDLER
    // ════════════════════════════════════════════════════════
    populateBtn.onClick = function () {

        if (!watchFolder) {
            alert("Please select a Watch Folder first.");
            return;
        }

        var compPfx  = compPfxInp.text;
        var layerPfx = layerPfxInp.text;

        if (!compPfx || !layerPfx) {
            alert("Naming prefixes must match your project setup.");
            return;
        }

        var allFiles = watchFolder.getFiles("*.jpg").concat(
                       watchFolder.getFiles("*.jpeg"));

        if (allFiles.length === 0) {
            alert("No JPG files found in the selected folder.");
            return;
        }

        // Count matching comps
        var matchingComps = [];
        for (var k = 1; k <= app.project.numItems; k++) {
            var it = app.project.item(k);
            if (it instanceof CompItem && it.name.indexOf(compPfx) === 0) {
                matchingComps.push(it);
            }
        }

        var numComps  = matchingComps.length;
        var numImages = allFiles.length;

        if (numComps === 0) {
            alert("No comps found with prefix \"" + compPfx + "\".\nRun Build Project first.");
            return;
        }

        // ── Mismatch warnings ─────────────────────────────────
        if (numImages > numComps) {
            var extra = numImages - numComps;
            var go = confirm(
                "WARNING: More images than comps.\n\n" +
                "Images in folder:  " + numImages + "\n" +
                "Comps available:   " + numComps  + "\n" +
                "Extra ignored:     " + extra      + "\n\n" +
                "Proceed with the first " + numComps + " images?\n" +
                "Press Cancel to fix and rerun."
            );
            if (!go) return;
        }

        app.beginUndoGroup("Project Populator: Populate");

        // ── Get or create the Your_Files folder ──────────────
        var yourFilesFolder = null;
        for (var yf = 1; yf <= app.project.numItems; yf++) {
            if (app.project.item(yf) instanceof FolderItem &&
                app.project.item(yf).name === "Your_Files") {
                yourFilesFolder = app.project.item(yf);
                break;
            }
        }
        if (!yourFilesFolder) {
            yourFilesFolder = app.project.items.addFolder("Your_Files");
        }

        var replaced = 0;
        var skipped  = 0;
        var problems = [];
        var limit    = Math.min(numImages, numComps);

        for (var i = 0; i < limit; i++) {
            var slideNum    = parseInt(i, 10) + 1;
            var p           = pad(slideNum);
            var precompName = compPfx  + p;
            var layerName   = layerPfx + p;

            // Find precomp
            var targetComp = null;
            for (var j = 1; j <= app.project.numItems; j++) {
                var item = app.project.item(j);
                if (item instanceof CompItem && item.name === precompName) {
                    targetComp = item;
                    break;
                }
            }
            if (!targetComp) {
                problems.push("Comp not found: " + precompName);
                skipped++;
                continue;
            }

            // Find placeholder layer
            var targetLayer = null;
            for (var l = 1; l <= targetComp.numLayers; l++) {
                if (targetComp.layer(l).name === layerName) {
                    targetLayer = targetComp.layer(l);
                    break;
                }
            }
            if (!targetLayer) {
                problems.push("Layer not found: " + layerName);
                skipped++;
                continue;
            }

            // Import footage
            var opts = new ImportOptions(allFiles[i]);
            opts.importAs = ImportAsType.FOOTAGE;
            var footage;
            try {
                footage = app.project.importFile(opts);
            } catch (e) {
                problems.push("Import failed: " + allFiles[i].name);
                skipped++;
                continue;
            }

            // Move footage into Your_Files folder
            footage.parentFolder = yourFilesFolder;

            // Swap
            targetLayer.replaceSource(footage, false);

            // Scale to fill (cover mode)
            var cW     = targetComp.width;
            var cH     = targetComp.height;
            var sW     = footage.width;
            var sH     = footage.height;
            var scaleX = (cW / sW) * 100;
            var scaleY = (cH / sH) * 100;
            var scale  = Math.max(scaleX, scaleY);

            targetLayer.property("Transform").property("Scale").setValue([scale, scale]);
            targetLayer.property("Transform").property("Position").setValue([cW / 2, cH / 2]);

            replaced++;
        }

        app.endUndoGroup();

        // ── Result alert ──────────────────────────────────────
        var unpopulated = numComps - replaced;
        var msg = "Populated " + replaced + " of " + numComps + " comp" + (numComps !== 1 ? "s" : "") + ".\n";

        if (unpopulated > 0 && numImages < numComps) {
            msg += "\n⚠ " + unpopulated + " comp" + (unpopulated !== 1 ? "s" : "") + " left unpopulated.\n";
            msg += "Add " + unpopulated + " more image" + (unpopulated !== 1 ? "s" : "") + " to the folder and rerun Populate.";
        }
        if (problems.length > 0) {
            msg += "\n\nIssues:\n" + problems.join("\n");
        }

        alert(msg);
    };


    // ════════════════════════════════════════════════════════
    //  SECTION 3 — REPLACE EXISTING COMPS
    // ════════════════════════════════════════════════════════
    var sec3 = makeSection(win, "03  REPLACE EXISTING");

    // ── MODE TOGGLE ──────────────────────────────────────────
    var modeRow = sec3.add("group");
    modeRow.orientation = "row";
    modeRow.alignment   = ["fill", "top"];
    modeRow.margins     = 0;
    modeRow.spacing     = 8;

    var modeLabel = modeRow.add("statictext", undefined, "TARGET:");
    setFont(modeLabel, "Tahoma", "Bold", 9);
    setFg(modeLabel, C.textMid);
    modeLabel.alignment = ["left", "center"];

    var modePfxBtn = modeRow.add("radiobutton", undefined, "By Prefix");
    setFont(modePfxBtn, "Tahoma", "Bold", 10);
    modePfxBtn.value = true;

    var modeSelBtn = modeRow.add("radiobutton", undefined, "By Selection");
    setFont(modeSelBtn, "Tahoma", "Bold", 10);

    // ── PREFIX FIELD (shown in prefix mode) ──────────────────
    var replacePfxGroup = sec3.add("group");
    replacePfxGroup.orientation = "column";
    replacePfxGroup.alignment   = ["fill", "top"];
    replacePfxGroup.margins     = 0;
    replacePfxGroup.spacing     = 3;

    var replaceCompPfxInp = makeField(replacePfxGroup, "Pre-comp prefix", "Comp_", 100);

    // ── SELECTION INFO (shown in selection mode) ──────────────
    var replaceSelGroup = sec3.add("group");
    replaceSelGroup.orientation = "column";
    replaceSelGroup.alignment   = ["fill", "top"];
    replaceSelGroup.margins     = 0;
    replaceSelGroup.spacing     = 3;
    replaceSelGroup.visible     = false;

    var replaceSelHint = replaceSelGroup.add("statictext", undefined,
        "Select comps in the Project panel, then click Replace Footage.", { multiline: true });
    replaceSelHint.alignment = ["fill", "top"];
    setFont(replaceSelHint, "Tahoma", "Regular", 9);
    setFg(replaceSelHint, C.textMid);

    var replaceSelCountLbl = replaceSelGroup.add("statictext", undefined, "");
    setFont(replaceSelCountLbl, "Tahoma", "Bold", 9);
    setFg(replaceSelCountLbl, C.accent);

    // ── MODE TOGGLE HANDLERS ─────────────────────────────────
    modePfxBtn.onClick = function () {
        replacePfxGroup.visible = true;
        replaceSelGroup.visible = false;
        try { win.layout.layout(true); } catch(e) {}
    };

    modeSelBtn.onClick = function () {
        replacePfxGroup.visible = false;
        replaceSelGroup.visible = true;
        try { win.layout.layout(true); } catch(e) {}
    };

    // ── BROWSE ROW ───────────────────────────────────────────
    var replaceFolderGroup = sec3.add("group");
    replaceFolderGroup.orientation = "column";
    replaceFolderGroup.alignment   = ["fill", "top"];
    replaceFolderGroup.margins     = 0;
    replaceFolderGroup.spacing     = 3;

    var replaceFolderTopRow = replaceFolderGroup.add("group");
    replaceFolderTopRow.orientation = "row";
    replaceFolderTopRow.alignment   = ["fill", "top"];
    replaceFolderTopRow.margins     = 0;
    replaceFolderTopRow.spacing     = 6;

    var replaceFolderLbl = replaceFolderTopRow.add("statictext", undefined, "NEW PHOTOS FOLDER");
    setFont(replaceFolderLbl, "Tahoma", "Bold", 9);
    setFg(replaceFolderLbl, C.textMid);
    replaceFolderLbl.alignment = ["left", "center"];

    var replaceBrowseBtn = replaceFolderTopRow.add("button", undefined, "BROWSE...");
    replaceBrowseBtn.alignment = ["right", "center"];
    replaceBrowseBtn.preferredSize = [80, 20];
    setFont(replaceBrowseBtn, "Tahoma", "Bold", 9);

    var replaceFolderPathLbl = replaceFolderGroup.add("statictext", undefined, "No folder selected", { truncate: "middle" });
    replaceFolderPathLbl.alignment = ["fill", "top"];
    setFont(replaceFolderPathLbl, "Tahoma", "Regular", 9);
    setFg(replaceFolderPathLbl, C.textDim);

    var replaceFileCountLbl = replaceFolderGroup.add("statictext", undefined, "");
    setFont(replaceFileCountLbl, "Tahoma", "Bold", 9);
    setFg(replaceFileCountLbl, C.textDim);

    var replaceBtn = makeBtn(sec3, "REPLACE FOOTAGE", 30);
    setFont(replaceBtn, "Tahoma", "Bold", 13);

    // ── STATE ────────────────────────────────────────────────
    var replaceFolder = null;

    // ── BROWSE HANDLER ───────────────────────────────────────
    replaceBrowseBtn.onClick = function () {
        var f = Folder.selectDialog("Select folder of new photos:");
        if (!f) return;
        replaceFolder = f;

        var p = f.fsName;
        replaceFolderPathLbl.text = p.length > 42 ? "..." + p.slice(-39) : p;
        setFg(replaceFolderPathLbl, C.textMid);

        var jpgs = f.getFiles("*.jpg").concat(f.getFiles("*.jpeg"));
        var n    = jpgs.length;
        replaceFileCountLbl.text = n + " JPG" + (n !== 1 ? "s" : "") + " found";
        setFg(replaceFileCountLbl, n > 0 ? C.btnPop : C.warn);
    };

    // ── REPLACE HANDLER ──────────────────────────────────────
    replaceBtn.onClick = function () {

        if (!replaceFolder) {
            alert("Please select a folder of new photos first.");
            return;
        }

        var allFiles = replaceFolder.getFiles("*.jpg").concat(
                       replaceFolder.getFiles("*.jpeg"));

        if (allFiles.length === 0) {
            alert("No JPG files found in the selected folder.");
            return;
        }

        // ── Build comp list based on mode ────────────────────
        var matchingComps = [];

        if (modePfxBtn.value) {
            // PREFIX MODE
            var compPfx = replaceCompPfxInp.text;
            if (!compPfx) {
                alert("Enter a pre-comp prefix to target.");
                return;
            }
            for (var k = 1; k <= app.project.numItems; k++) {
                var it = app.project.item(k);
                if (it instanceof CompItem && it.name.indexOf(compPfx) === 0) {
                    matchingComps.push(it);
                }
            }
            // Sort by name
            matchingComps.sort(function(a, b) {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            });
            if (matchingComps.length === 0) {
                alert("No comps found with prefix \"" + compPfx + "\".");
                return;
            }

        } else {
            // SELECTION MODE
            var sel = app.project.selection;
            if (!sel || sel.length === 0) {
                alert("Nothing selected in the Project panel.\nSelect one or more comps and try again.");
                return;
            }
            for (var s = 0; s < sel.length; s++) {
                if (sel[s] instanceof CompItem) {
                    matchingComps.push(sel[s]);
                }
            }
            if (matchingComps.length === 0) {
                alert("No comps found in your selection.\nMake sure you have comps (not folders or footage) selected in the Project panel.");
                return;
            }
            // Sort by name for predictable order
            matchingComps.sort(function(a, b) {
                return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            });
        }

        var numComps  = matchingComps.length;
        var numImages = allFiles.length;

        // Mismatch warnings
        if (numImages > numComps) {
            var extra = numImages - numComps;
            var go = confirm(
                "WARNING: More images than comps.\n\n" +
                "Images in folder:  " + numImages + "\n" +
                "Comps targeted:    " + numComps  + "\n" +
                "Extra ignored:     " + extra      + "\n\n" +
                "Proceed with the first " + numComps + " images?\n" +
                "Press Cancel to fix and rerun."
            );
            if (!go) return;
        }

        // Get or create Your_Files folder
        var yourFilesFolder = null;
        for (var yf = 1; yf <= app.project.numItems; yf++) {
            if (app.project.item(yf) instanceof FolderItem &&
                app.project.item(yf).name === "Your_Files") {
                yourFilesFolder = app.project.item(yf);
                break;
            }
        }
        if (!yourFilesFolder) {
            yourFilesFolder = app.project.items.addFolder("Your_Files");
        }

        app.beginUndoGroup("Project Populator: Replace");

        var replaced = 0;
        var skipped  = 0;
        var problems = [];
        var limit    = Math.min(numImages, numComps);

        for (var i = 0; i < limit; i++) {
            var targetComp = matchingComps[i];

            // Find first non-solid footage layer
            var targetLayer = null;
            for (var l = 1; l <= targetComp.numLayers; l++) {
                var lyr = targetComp.layer(l);
                if (lyr.source instanceof FootageItem &&
                    !(lyr.source.mainSource instanceof SolidSource)) {
                    targetLayer = lyr;
                    break;
                }
            }
            // Fallback: first layer with any source
            if (!targetLayer) {
                for (var m = 1; m <= targetComp.numLayers; m++) {
                    if (targetComp.layer(m).source) {
                        targetLayer = targetComp.layer(m);
                        break;
                    }
                }
            }

            if (!targetLayer) {
                problems.push("No replaceable layer in: " + targetComp.name);
                skipped++;
                continue;
            }

            // Import new footage
            var opts = new ImportOptions(allFiles[i]);
            opts.importAs = ImportAsType.FOOTAGE;
            var footage;
            try {
                footage = app.project.importFile(opts);
            } catch (e) {
                problems.push("Import failed: " + allFiles[i].name);
                skipped++;
                continue;
            }

            footage.parentFolder = yourFilesFolder;
            targetLayer.replaceSource(footage, false);

            // Scale to fill
            var cW     = targetComp.width;
            var cH     = targetComp.height;
            var sW     = footage.width;
            var sH     = footage.height;
            var scaleX = (cW / sW) * 100;
            var scaleY = (cH / sH) * 100;
            var scale  = Math.max(scaleX, scaleY);

            targetLayer.property("Transform").property("Scale").setValue([scale, scale]);
            targetLayer.property("Transform").property("Position").setValue([cW / 2, cH / 2]);

            replaced++;
        }

        app.endUndoGroup();

        var unpopulated = numComps - replaced;
        var msg = "Replaced footage in " + replaced + " of " + numComps + " comp" + (numComps !== 1 ? "s" : "") + ".\n";
        if (unpopulated > 0 && numImages < numComps) {
            msg += "\n⚠ " + unpopulated + " comp" + (unpopulated !== 1 ? "s" : "") + " not updated.\n";
            msg += "Add " + unpopulated + " more image" + (unpopulated !== 1 ? "s" : "") + " and rerun Replace.";
        }
        if (problems.length > 0) {
            msg += "\n\nIssues:\n" + problems.join("\n");
        }
        alert(msg);
    };

    // ── SHOW ─────────────────────────────────────────────────
    if (win instanceof Window) {
        win.center();
        win.show();
    } else {
        win.layout.layout(true);
    }

}(this));
