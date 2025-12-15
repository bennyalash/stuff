export function BridgesHelp() {
  return (
    <>
      <h4>Create a path across the water by building the correct pattern of bridges.</h4>

      <p>Your goal is to place bridges so that:</p>
      <p>1. Each row and column uses exactly the number of bridges shown at the edges of the grid.</p>
      <p>2. A continuous path connects the Start to the Destination.</p>

      <h3>Placing Bridges</h3>
      <p>Tap a cell to place or remove a bridge.</p>
      <p>Start and Destination tiles cannot be changed.</p>
      <p>Numbers fade out as their requirements are satisfied.</p>

      <h3>Winning</h3>
      <p>You win when all row and column numbers reach zero and a continuous path connects Start to Destination.</p>
    </>
  );
}

export function RootsHelp() {
  return (
    <>
      <h4>Transform the starting word into the target word, changing one letter at a time.</h4>

      <p>Your goal is to turn the start word into the end word by making a series of valid English words.</p>

      <h3>How to Play</h3>
      <p>Tap a letter in the current word to select it.</p>
      <p>Use the keyboard to replace it with a new letter.</p>
      <p>Each move must create a <strong>real, valid word</strong>.</p>
      <p>Only one letter can change per move.</p>
      <p>Your past words appear below, forming a chain from the start word to the end word.</p>

      <h3>Winning</h3>
      <p>You win when your current word matches the target word.</p>
    </>
  );
}

      export function CipherHelp() {
  return (
    <>
      <h4>Slide rows and columns to restore the hidden 4x4 word grid.</h4>

      <p>Your puzzle begins with the nine inner letters scrambled. Each move rotates one row or column, shifting its three letters in a loop.</p>

      <h3>How to Play</h3>
      <p><strong>Rotate a row:</strong> Drag left or right on any tile in that row.</p>
      <p><strong>Rotate a column:</strong> Drag up or down on any tile in that column.</p>
      <p>Letters wrap around, so the tile that moves off one side reappears on the opposite side.</p>

      <h3>Goal</h3>
      <p>Rearrange the letters until the entire 4x4 grid matches the solved pattern.</p>
    </>
  );
}
