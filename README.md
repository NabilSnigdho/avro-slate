# Avro Slate

Avro Slate is is a full featured Avro Phonetic application with dictionary support. It is built with [Slate](https://github.com/ianstormtaylor/slate), [Windi CSS](https://windicss.org), [Vite](https://vitejs.dev), [অক্ষর - Okkhor](https://github.com/gulshan/okkhor) and many other awesome libraries and tools.

Avro Slate is inspired by [AvroPad](https://github.com/omicronlab/avro-pad/) and provides almost the same functionality and UI. Avro Slate also uses dictionary data and code from [ibus-avro](https://github.com/sarim/ibus-avro), so the dictionary suggestion is expected to be somewhat identical with some enhancements(see the differences below). A portion of the avro phonetic library is taken from [riti (রীতি)](https://github.com/OpenBangla/riti/). Riti might be included with wasm support as the backend in future versions.

## Suggestion differences from AvroPad

Currently known differences are:
- Full stop(".") in number is not converted into Dari("।")
```js
// For input "1.5" candidates will be
["১.৫", "1.5"]
```
- Full stops(".") in abbreviations are not converted into Dari("।")
```js
// For input "es.es.si." candidates will be
["এস.এস.সি.", "es.es.si."]
```
- The phonetic value of input is guaranteed to appear in suggestion.
```js
// For input "kOnO"
// Candidates in Avro Slate
["কোন", "কোনও", "কওন", "কোঁ", "কোং","কোণ", "কন", "কওনও", "কোঁও", "কোনো", "kOnO"]
// Candidates in AvroPad(phonetic value "কোনো" is missing)
["কোন", "কোনও", "কওন", "কোঁ", "কোং","কোণ", "কন", "কওনও", "কোঁও", "কোঙও", "kOnO"]
```

## Android support

One of the key features of Avro Slate is that it behaves similar to the native IMs. It does not reads the value from the text field but from the keyboard event. As most Android on-screen keyboards does NOT send key-codes on keyboard events, Avro Slate is not supported in Android.

## Development

### Install npm dependencies
```sh
npm install
```
### Build Rust wasm crates

Install [Rust toolchain](https://www.rust-lang.org/tools/install), and [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/), then run,
```sh
npm run wasm
```
### Start dev server

```sh
npm run dev
```

### Production Build

To build the project for production, run
```sh
npm run build
```
This will build the project under ./dist directory.

To locally preview the production build, run
```sh
npm run preview
```

## Contributing
Pull requests are welcome. Open an issue for bug report, feature request or suggestions regarding ui, keyboard behavior etc.

## Acknowledgements
* [হাসান জলছবি](https://lipighor.com/HasanJolchobi.html) font used in logo
* [AvroPad](https://github.com/omicronlab/avro-pad/) by OmicronLab
* [ibus-avro](https://github.com/sarim/ibus-avro) by Sarim Khan
* [অক্ষর - Okkhor](https://github.com/gulshan/okkhor) by Gulshan
* [OBK](https://github.com/OpenBangla/OpenBangla-Keyboard) and [riti (রীতি)](https://github.com/OpenBangla/riti/) by OpenBangla

## License

This project is licensed under [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).