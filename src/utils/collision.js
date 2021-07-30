// Collision detection function
export function collisionDetect(char1, char2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;
  // check props exist to avoid crash every time anything is saved
  if (char1.width && char1.height && char2.width && char2.height) {
    //Find the center points of each sprite
    char1.centerX = char1.x + char1.width / 2;
    char1.centerY = char1.y + char1.height / 2;
    char2.centerX = char2.x + char2.width / 2;
    char2.centerY = char2.y + char2.height / 2;

    //Find the half-widths and half-heights of each sprite
    char1.halfWidth = char1.width / 2;
    char1.halfHeight = char1.height / 2;
    char2.halfWidth = char2.width / 2;
    char2.halfHeight = char2.height / 2;

    //Calculate the distance vector between the sprites
    vx = char1.centerX - char2.centerX;
    vy = char1.centerY - char2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = char1.halfWidth + char2.halfWidth;
    combinedHalfHeights = char1.halfHeight + char2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        //There's definitely a collision happening
        hit = true;
      } else {
        //There's no collision on the y axis
        hit = false;
      }
    } else {
      //There's no collision on the x axis
      hit = false;
    }
  }

  //`hit` will be either `true` or `false`
  return hit;
}
