# _`Coin Chaser`_

---

## `Objectives`

--

- To write a desktop app that is different to previously written apps
- To develop an MVP for an app, in the time available, that proves we can learn and develop new technologies ourselves
- To enhance our portfolios with a stand-out app
- To have a list of additional features that can be added to the completed MVP to prove we are able to 'manage' the development of an app and not just 'write an app'

---

## `Anti-Goals`

--

- A marketable app; the time is not available

---

## `The Game`

--

_Screen 1_
![coin chaser](assets/coin-chaser-screen-1.jpg)

--

- 2 players chase after a box on the screen by using mouse clicks to denote direction
- The box is opened when the first player reaches it
- The box reveals a coin that has a value
- This value is added to the player's score

--

_Screen 2_
![coin chaser](assets/coin-chaser-screen-2.jpg)

--

- 2 boxes appear on the screen for the players to chase
- Each box is opened when the player reaches it
- Only 1 of the boxes contains a coin
- The screen ends when the coin is found
- The value of the coin is added to the player's score

--

_Subsequent Screens_
![coin chaser](assets/coin-chaser-screen-3.jpg)

--

- An additional box is added on each new screen up to a limit (TBD)
- There is only ever 1 coin in the boxes
- Other boxes are empty
- The player, therefore, has to chase after another box if they reach and open an empty one

--

- If time is available, add other items / modifiers into some of the boxes; these items either enhance the player's score, they have some effect on the other players score, they prevent the other player from moving their character for a few seconds, they make it so the other player has to click twice to move once, etc

---

## `New Technologies`

--

- Learn how to display a background board on the screen and have characters move over the top of the board using mouse clicks
- If time, add functionality to do these movements using key presses
- Learn how to have interactivity between 2 remote players by sending the co-ordinates of each player to the other players in real time using a back-end server

---

## `Front End Development`

--

- Develop a background screen comprising a grid, and have a character move around the 'board' using mouse clicks, up, down, left and right
- Display a box at a random grid position
- When the user lands on the same co-ordinate as the box, open the box and reveal a coin
- Develop a score counter for collected coins (similar tech to a link or star button)

--

- Develop functionality to later display another character on the screen using co-ordinates provided from the back-end
- Develop functionality to act on codes received from the back end such as what to do when a code is recieved indicating a player has reached a box
- Develop a login system so only logged in players can play the game

--

- If time, develop the game so more than 2 players can play simultaneously
- If time, display a different / random background screen each time a new screen opens
- If time, add a high score counter, with the highest score always kept on the server in a database
- If time, develop a messaging chat system on the side of the screen for players to communicate

---

## `Link to the Back-End`

--

- Send the x, y co-ordinates of the character's position to the back-end, each time a character moves
- Receive the co-ordinates of the box(es) at the start of a new screen
- Receive random co-ordinates for the characters each time a new screen opens
- Receive codes from the back end to indiacte when a player reaches a box and what is inside the box

---

## `Back End Development`

--

- Develop a login system so logged in players can play against each other remotely
- Create random co-ordinates for logged in characters each time a new screen starts
- Create random co-ordinates for boxes, the coin and other items in the boxes and deliver these to the front ends all at the same time

--

- Send and receive new co-ordinates for characters to all players
- Send codes to the front ends to indicate a player has opened a box and what is inside the box they have reached
- Keep track of the scores for each character playing
- Keep track of the high score, if time

---

## `Positioning Server`

--

- Sending the character co-ordinates in realtime to each player is seen as the biggest challenge in this app
- Research is required on the different ways this can be achieved
- The instant messaging system by Firebase may be a possible option
- It may be possible for the back end server to handle the delivery of the co-ordinates

---

## `User Stories`

--

## `Minumum Viable Product`

--

- As a user, I will firstly have to log in to play the game
- As a user, I will then see my login name in the top right corner of the screen
- As a user, I will then also see the icon of my character next to my username
- As a user, I need an opponent to play; this opponent also needs to be logged in
- As a user, I can see the username of my opponent at the bottom of the screen
- As a user, I can see the icon of the character of my opponent

--

- As a user, I can select the start icon to start the game, when my opponent is also logged in
- As a user, I can then see my own character on a playing screen
- As a user, I can also then see my opponent's character on the playing screen
- As a user, I can also see an image of a closed box on the playing screen
- As a user, I can use arrow icons to move my character around the playing screen
- As a user, I can also use the arrow keys on the keyboard to move my character around

--

- As a user, I am expected to move my character to the closed box image
- As a user, I a expected to reach the box before my opponent
- As a user, I will be prevented from occupying the same position as my opponent
- As a user, I will win the round if I first get to the box containing the coin
- As a user, if I reach the box first, it opens and reveals a coin to me; the value of this coin is then added to my score

--

- As a user, I can see my score represented in the corner of the screen
- As a user, I can see my opponent's score represented in the corner of the screen
- As a user, I am then invited to play the next round of a certian number of rounds (TBD)
- As a user, I win the game if I have got the most points after the certain number of rounds

---

## `Additional Features`

--

- As a user, I will see an extra box on the screen during the second round
- As a user, I will have to choose which box to head towards
- As a user, I will see the box open if I reach it before my opponent reaches the box containing the coin
- As a user, I will gain the coin if I am lucky enough to get to the box containing the coin, first

--

- As a user, I must answer a question correctly before I can have the coin, if I am the first player to the box containing the coin

--

- As a user, I will find that later screens will reveal modifiers / penalties in some of the empty boxes. eg freeze the user for 2 seconds
- As a user, I will see a high score count
- As a user I will be able to message my opponent in a the chat screen
- As a user, I will be able to play up to 5 other plays on the screen at the same time

---

## `This was 'Coin Chaser'`
