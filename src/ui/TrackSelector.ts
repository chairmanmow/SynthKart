/**
 * TrackSelector - Screen for selecting a track before racing.
 *
 * This is a modular component that can be used in different game flows.
 * Returns the selected TrackDefinition or null if user cancelled.
 */

/**
 * Result of track selection.
 */
interface TrackSelectionResult {
  selected: boolean;
  track: TrackDefinition | null;
}

/**
 * Display the track selector and wait for user input.
 * @returns Selected track or null if cancelled
 */
function showTrackSelector(): TrackSelectionResult {
  var tracks = getAllTracks();
  var selectedIndex = 0;
  var pageSize = 5;  // Tracks visible per page
  var scrollOffset = 0;

  // Initial draw (autopause=false to prevent "Hit a Key" prompt)
  console.clear(LIGHTGRAY, false);
  drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize);

  while (true) {
    // Wait for input - use K_UPPER to normalize case, K_NOECHO to prevent echo
    var key = console.inkey(K_UPPER, 500);
    
    if (key === '') continue;

    var needsRedraw = false;

    // Check for arrow keys using Synchronet's KEY_* constants
    // These are multi-character escape sequences
    if (key === KEY_UP) {
      selectedIndex--;
      if (selectedIndex < 0) selectedIndex = tracks.length - 1;
      needsRedraw = true;
    }
    else if (key === KEY_DOWN) {
      selectedIndex++;
      if (selectedIndex >= tracks.length) selectedIndex = 0;
      needsRedraw = true;
    }
    // W/S for up/down (already uppercase from K_UPPER)
    else if (key === 'W' || key === '8') {
      selectedIndex--;
      if (selectedIndex < 0) selectedIndex = tracks.length - 1;
      needsRedraw = true;
    }
    else if (key === 'S' || key === '2') {
      selectedIndex++;
      if (selectedIndex >= tracks.length) selectedIndex = 0;
      needsRedraw = true;
    }
    // Enter or space to select
    else if (key === '\r' || key === '\n' || key === ' ') {
      return {
        selected: true,
        track: tracks[selectedIndex]
      };
    }
    // Number keys 1-9 for quick select AND confirm
    else if (key >= '1' && key <= '9') {
      var quickIndex = parseInt(key, 10) - 1;
      if (quickIndex < tracks.length) {
        // Immediately select and start
        return {
          selected: true,
          track: tracks[quickIndex]
        };
      }
    }
    // Q or Escape to go back
    else if (key === 'Q' || key === KEY_ESC) {
      return {
        selected: false,
        track: null
      };
    }

    // Adjust scroll if needed
    if (needsRedraw) {
      if (selectedIndex < scrollOffset) {
        scrollOffset = selectedIndex;
      }
      if (selectedIndex >= scrollOffset + pageSize) {
        scrollOffset = selectedIndex - pageSize + 1;
      }
      
      // Redraw (autopause=false to prevent "Hit a Key" prompt)
      console.clear(LIGHTGRAY, false);
      drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize);
    }
  }
}

/**
 * Draw the track selector screen.
 */
function drawTrackSelectorScreen(
  tracks: TrackDefinition[],
  selectedIndex: number,
  scrollOffset: number,
  pageSize: number
): void {
  // Header
  console.attributes = LIGHTMAGENTA;
  console.print("\r\n");
  console.print("  ========================================\r\n");
  console.attributes = LIGHTCYAN;
  console.print("           SELECT YOUR TRACK\r\n");
  console.attributes = LIGHTMAGENTA;
  console.print("  ========================================\r\n");
  console.print("\r\n");

  // Track list
  var endIndex = Math.min(scrollOffset + pageSize, tracks.length);
  
  for (var i = scrollOffset; i < endIndex; i++) {
    var track = tracks[i];
    var isSelected = (i === selectedIndex);
    var displayNum = i + 1;

    // Selection indicator
    if (isSelected) {
      console.attributes = LIGHTCYAN;
      console.print("  >> ");
    } else {
      console.attributes = DARKGRAY;
      console.print("     ");
    }

    // Track number
    console.attributes = isSelected ? WHITE : LIGHTGRAY;
    console.print(displayNum + ". ");

    // Track name
    console.attributes = isSelected ? LIGHTCYAN : CYAN;
    console.print(padRight(track.name, 20));

    // Difficulty stars
    console.attributes = isSelected ? YELLOW : BROWN;
    console.print(" [" + renderDifficultyStars(track.difficulty) + "] ");

    // Lap count
    console.attributes = isSelected ? LIGHTGRAY : DARKGRAY;
    console.print(track.laps + " laps");

    console.print("\r\n");

    // Description (only for selected)
    if (isSelected) {
      console.attributes = LIGHTGRAY;
      console.print("        " + track.description + "\r\n");
      console.attributes = DARKGRAY;
      console.print("        Est. lap time: ~" + track.estimatedLapTime + "s\r\n");
    }
  }

  // Scroll indicators
  if (scrollOffset > 0) {
    console.attributes = DARKGRAY;
    console.print("\r\n     ^ More tracks above ^\r\n");
  }
  if (endIndex < tracks.length) {
    console.attributes = DARKGRAY;
    console.print("\r\n     v More tracks below v\r\n");
  }

  // Preview selected track theme
  console.print("\r\n");
  drawTrackPreview(tracks[selectedIndex]);

  // Controls
  console.print("\r\n");
  console.attributes = LIGHTMAGENTA;
  console.print("  ----------------------------------------\r\n");
  console.attributes = LIGHTGRAY;
  console.print("  W/S or UP/DOWN = Navigate    ENTER = Select\r\n");
  console.print("  1-9 = Quick Select           Q = Back\r\n");
  console.attributes = LIGHTMAGENTA;
  console.print("  ----------------------------------------\r\n");
}

/**
 * Draw a mini preview of the track theme.
 */
function drawTrackPreview(track: TrackDefinition): void {
  var theme = getTrackTheme(track);
  
  console.attributes = DARKGRAY;
  console.print("  Theme: ");
  console.attributes = LIGHTGRAY;
  console.print(theme.name + "\r\n");

  // Mini color preview bar
  console.print("  ");
  
  // Sky color
  console.attributes = theme.sky.top.fg;
  console.print(String.fromCharCode(219) + String.fromCharCode(219));
  
  // Horizon
  console.attributes = theme.sky.horizon.fg;
  console.print(String.fromCharCode(219) + String.fromCharCode(219));
  
  // Sun
  console.attributes = theme.sun.color.fg;
  console.print(String.fromCharCode(219) + String.fromCharCode(219));
  
  // Road
  console.attributes = theme.road.surface.fg;
  console.print(String.fromCharCode(219) + String.fromCharCode(219));
  
  // Edge
  console.attributes = theme.road.edge.fg;
  console.print(String.fromCharCode(219) + String.fromCharCode(219));
  
  // Offroad
  console.attributes = theme.offroad.groundColor.fg;
  console.print(String.fromCharCode(219) + String.fromCharCode(219));
  
  // Background
  console.attributes = theme.background.color.fg;
  console.print(String.fromCharCode(219) + String.fromCharCode(219));

  console.attributes = LIGHTGRAY;
  console.print("\r\n");
}

/**
 * Pad string to the right.
 */
function padRight(str: string, len: number): string {
  while (str.length < len) {
    str += ' ';
  }
  return str.substring(0, len);
}
