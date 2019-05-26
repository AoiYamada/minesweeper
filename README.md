## Installation
```bash
npm i git+http://
```

## Usage
```html
<script src="./dist/MineSweeper.js"></script>
```

## Creat a new game
```js
var game = new MineSweeper({
	width: 10,
	height: 10,
	mine: 10,
});
```

## Play it in console
only 2 methods are avalible
```js
var open = (x, y) => {
  game.open(x, y);
  console.log("Time:", game.timer);
  console.log("State:", game.state);
  console.log(game.toString())
}
var flag = (x, y) => {
  game.flag(x, y);
  console.log(game.toString())
}
```

## Develop
```
npm run build
```