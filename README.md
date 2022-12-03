<h1 align="center">XCoder</h>

<h3 align="center"> Nodes.js Tool for processing .sc files with various options.
 <br></h3>
<br>

## Installing:
Create a folder in any place convenient for you. Then open a terminal inside it and run the command:
```
npm install @daniil_sv/xcoder -g
```
<strong>After the first launch</strong>, you will go through a small configuration process during which working folders will be created.

## How to run:
Run command:
```
xcoder
```
After that you will see options menu

## Available features:
> [Textures](#texture_main)
- [Decoding .sc to .png](#texture_decoding)
- [Encoding from .png to .sc](#texture_encoding)

> [Compressing](#compressing_main)
- [File decompressing](#decompressing)
- [File compressing](#compressing)

<br/><br/>

## Textures <a name = "texture_main"></a>
This version has some changes compared to ["original"](https://github.com/vorono4ka/Xcoder) python one.
The main goal is to provide maximum flexibility by removing dumb restrictions..
Because of this, here all information about textures is contained in readable json and not in binary .xcod files.
Json is composed of a list of textures that can be changed or added to.
Below is a table with a description of each parameter of such a texture.
Each parameter can be optional

- All descriptions are taken from ["supercell-swf](https://github.com/scwmake/supercell-swf-ts/wiki)

|     Name    |       Type       |                                                     Description                                                     |                                             Possible values                                             |
|:-----------:|:----------------:|:-------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------:|
| pixelFormat | string OR number |                        [Texture pixel type](https://www.khronos.org/opengl/wiki/Image_Format)                       | GL_RGBA8, GL_RGBA4, GL_RGB5_A1, GL_RGB565, GL_LUMINANCE8_ALPHA8, GL_LUMINANCE8 or index of these values |
| linear      |      boolean     |               If enabled, writes a pixel linearly. Otherwise, it uses a special pixel blocking system.              | true, false                                                                                             |
| downscaling |      boolean     |                                        Allows you to use mipmaps on texture.                                        | true, false                                                                                             |
| magFilter   | string OR number |                 [Mag filter](https://gdbooks.gitbooks.io/legacyopengl/content/Chapter7/MinMag.html)                 | GL_LINEAR, GL_NEAREST, GL_LINEAR_MIPMAP_NEAREST or index of these values                                |
| minFilter   | string OR number |                 [Min filter](https://gdbooks.gitbooks.io/legacyopengl/content/Chapter7/MinMag.html)                 | GL_LINEAR, GL_NEAREST, GL_LINEAR_MIPMAP_NEAREST or index of these values                                |
| width       |      number      |  Texture width. If it does not match the size of the actual texture, it will be prompted to change it or ignore it. | Any positive number to 8096                                                                             |
| height      |      number      | Texture height. If it does not match the size of the actual texture, it will be prompted to change it or ignore it. | Any positive number to 8096                                                                             |

## Decoding .sc to .png <a name = "texture_decoding"></a>
To decode sc to png you need to copy your files to  ```Sc-Textures/In-SC-Textures/```
and run the operation in XCoder, after that get folders with output in ```Sc-Textures/Out-Textures/```.
Folders contain textures and a ["json"](#texture_main) file with information about them.

## Encoding from .png to .sc <a name = "texture_encoding"></a>
You have 2 ways:
1. ["Decode"](#texture_decoding) and modify existing files and add them to ```Sc-Textures/In-Textures/```.
2. You can create textures from scratch. Create a folder in ```Sc-Textures/In-Textures/``` with name of texture and put png there. Json file is optional.

After that, you can get files in ```Sc-Textures/Out-SC-Textures/```.

<br/><br/>

## Comressing <a name = "compressing_main"></a>
There are also changes here. In Python version, compressor could only decompress csv files. This one supports compression of all files. Be careful if you want to compress or decompress a .sc file, make sure its name ends in ".sc".

## File decompressing <a name = "decompressing"></a>
Place your files in ```Compressing/In-Compressed-files/```, start decompression operation and take files in ```Compressing/Out-files```.
### Terminal access:
To decompress file, run following command:
```
sc-decompress
```

Command arguments:
```
-i, --input : Required parameter. Path to folder with files or path to file. If a folder is specified and no output is specified, creates a new folder with "_decompressed" prefix that will contain processed files.

-o, --output : Optional parameter. Name of output file. If not specified and if input is a file then it will be overwritten.
```

Examples:
```
sc-decompress -i sc/ui.sc -o sc/ui_decompressed.sc
````
<strong> OR </strong>
```
sc-decompress -i sc/
```
<em><strong>output will automatically be "sc_decompressed/"</strong></em>.

## File compressing <a name = "compressing"></a>
Place your files in ```Compressing/In-files/```, start compression operation and take files in ```Compressing/Out-compressed-files/```.
Uses compression method currently selected in XCoder.
### Terminal access:
To compress file, run following command:
```
sc-compress
```

Command arguments:
```
-i, --input : Required parameter. Path to folder with files or path to file. If a folder is specified and no output is specified, creates a new folder with "_compressed" prefix that will contain processed files.

-o, --output : Optional parameter. Name of output file. If not specified and if input is a file then it will be overwritten.
```

Examples:
```
sc-compress -i sc/ui_decompressed.sc -o  sc/ui.sc
````
<strong> OR </strong>
```
sc-decompress -i sc/
```
<em><strong>output will automatically be "sc_compressed/"</strong></em>.

<br/><br/>

## Authors:
- [@Daniil-SV](https://github.com/Daniil-SV) - All code
- [@Vorono4ka](https://github.com/Vorono4ka) & [@MasterDevX](https://github.com/MasterDevX) - Сode for console and general concept

## TODO:
- Sprite decoding feature
- Decoding to JSON
