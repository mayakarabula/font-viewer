# font-viewer (WIP)
Font Preview in Terminal (Javascript)

### Motivation
I recently read an article on omgubuntu titled ["Want to Preview Fonts using a Terminal? Now You Can!"](https://www.omgubuntu.co.uk/2020/02/command-line-font-preview-tool). I thought the idea was cool but I wasn't able to get it running on Mac and from screenshots it looked it's not really previewing fonts in the terminal, just in another window. So I started this small side project to do that.

### Use
* `yarn` to install dependencies
* `yarn build` to build the project
* `yarn start` to start the project
* `yarn lint` to test code style

### Scope
* Listing all installed fonts, move through items with *arrow keys*
* Upon clicking `return` the selected font from the list will be presented on the right side of the terminal
* Upon clicking `/` search box will appear in the top right corner of the list, then user can input name of the font and the list will be filtered accordingly
  * To close and clear search box click `/` again

### Preview
![Preview](/screenshots/2020-04-20.gif)
