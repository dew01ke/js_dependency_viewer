## JS Dependency Viewer
A simple tool to find all external dependencies of your project.

### How to install:

#### Globally
```text
npm install -g js-dependency-viewer
```

Then you can run from your terminal with parameters:
1. Required parameter `--target="/path/to/application"`
2. Optional parameter `--out="result.json"` (default: stdout to console)
3. Optional parameter `--ext="extension1,extension2,extension3"` (default: `['.vue', '.js', '.ts', '.js6', '.es6']`)

```text
jdv --target="/path/to/application" --out="result.json"
```

#### Locally:

```text
npm install --save js-dependency-viewer
```

```javascript
const jdv = require('js-dependency-viewer');

jdv.find('/path/to/application').then((dependencyObject) => {
    // ...
});
```

### Output:
```json
[{
    "module": "debounce",
    "size": 11.3,
    "methods": [{
        "name": "debounce",
        "location": [
            "target\\src\\component1.vue",
            "target\\src\\component2.vue",
            "target\\src\\component3.vue"
        ]
    }]
}, {  
    "module":"lodash",
    "size": 1361.92,
    "methods":[  
        {  
        "name":"get",
        "location":[  
            "target\\src\\file1.ts",
            "target\\src\\file2.ts"
        ]},
        {  
        "name":"each",
        "location":[  
            "target2\\src\\file3.ts"
        ]}
    ]
}]
```
