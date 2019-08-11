## JS Dependency Viewer

### How to run:
1. node ./build/jdv.js
2. Required parameter `--target="/path/to/application"`
3. Optional parameter `--out="result.json"` (default: stdout to console)


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
            "target2\\src\\file1.ts",
            "target2\\src\\file2.ts"
        ]},
        {  
        "name":"each",
        "location":[  
            "target2\\src\\file3.ts"
        ]}
    ]
}]
```
