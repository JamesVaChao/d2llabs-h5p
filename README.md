## References 
h5p cli: https://github.com/h5p/h5p-cli

h5p local setup guide (Read if below is outdated) : https://github.com/h5p/h5p-cli/blob/master/assets/docs/setup.md

h5p doc/specification: https://h5p.org/documentation/developers/h5p-specification



## Setup a development environment 

Install h5p cli using above link.

Make a new folder, lets call it `/dev-environment`

Navigate inside `/dev-environment`

Install h5p core with `h5p core` command 

List available h5p libraries with `h5p list`

Install reference library or setup local library (Skip reference library step as we care more about local)

Reference libraries can be installed via `h5p setup library_name`. Ex. `h5p setup h5p-true-false` 

For local libraries clone the `h5p-socratic-method` repo into the /dev-environment/libraries folder 

H5p-socratic-method: https://github.com/D2L-Labs/h5p-socratic-method 

![image](https://github.com/user-attachments/assets/08834474-071f-4758-89b2-58b42fee6c25)

Run command to see what's required to setup: `h5p missing h5p-socratic-method`

Then this command to add proper entry for dependencies: `h5p setup h5p-socratic-method` 

Edit `dev-environment/libraryRegistry.json` 

Modify last element inside the `libraryRegistry.json` with key `H5P.SocraticMethod` and add to the object the following to match the other object. This links it to our github. 

```
"repo": { 
    "type": "github", 
    "url": "https://github.com/D2L-Labs/h5p-socratic-method" 
}
```

Should look like:
 ![image](https://github.com/user-attachments/assets/e8b7891f-3875-484e-9494-fd35e20adc4c)

Run this command again to properly link folders: `h5p setup h5p-socratic-method `

Should get `done setting up h5p-socratic-method` 

<img width="514" alt="image" src="https://github.com/user-attachments/assets/91f2c9e5-d535-41a8-8a1f-bc9a65cefe39">

Run server from top level `/dev-environment` with: 

`h5p server`

Navigate to url given.
 
Click "New"  

Should be able to create a socratic-method type interactive 

<img width="484" alt="image" src="https://github.com/user-attachments/assets/2eb20e1d-9071-41e2-aa8e-abb060834079">







## License

(The MIT License)

Copyright (c) 2016 Joubel AS

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
