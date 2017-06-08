# kibana-API
Kibana-API is an extension to Kibana that lets you tap in to the dashboard management board from your app and change the visualizations dynamically.


## Demo
![alt text](https://github.com/Webiks/kibana-API/blob/master/demo.gif)

## postMessage
The plugin uses Window.postMessage() method (https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), to connect between the applicaion and the kibana iframe

`var iframe = document.getElementById('Iframe');`

in javascript use:<br />
 `var iWindow=iframe.contentWindow`
 
in typescript use: <br />
 `var iWindow = (<HTMLIFrameElement>iframe).contentWindow;`
    
`iWindow.postMessage({}, '*');`

## Events
## setVisualization 
(https://github.com/Webiks/kibana-API/wiki)  

In order to create a visualization you need to call the plugin with the visualization state.
Kibana-API is able to recieve all the visualization's properties (`isFullState = true`) -  [fullState](https://github.com/Webiks/kibana-API/wiki/Full-visState).
In case you do not wish to define all the visualization's properties (`isFullState = false`), you can pass some and Kibana-API will automatically fill-in the rest. [partial visState](https://github.com/Webiks/kibana-API/wiki/Partial-visState)

[Add visualization](https://github.com/Webiks/kibana-API/wiki/Add-Visualization)    

[Replace visualization](https://github.com/Webiks/kibana-API/wiki/Replace-Visualization)    



# Install
#### Kibana 5.4.1
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.4.1/kibana_api-5.4.1.zip
```
#### Kibana 5.4.0
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.4.0/kibana_api_5.4.0.zip
```
#### Kibana 5.3.2
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.3.2/kibana_api-5.3.2.zip
```
#### Kibana 5.3.1
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.3.1/kibana_api-5.3.1.zip
```
#### Kibana 5.3.0
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.3.0/kibana_api-5.3.0.zip
```
#### Kibana 5.2.2
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.2.2/kibana_api-5.2.2.zip
```
#### Kibana 5.1.2
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.1.2/kibana_api-5.1.2.zip
```
#### Kibana 5.1.1
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.1.1/kibana_api-5.1.1.zip
```
#### Kibana 5.0.2
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.0.2/kibana_api-5.0.2.zip
```
#### Kibana 5.0.1
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.0.1/kibana_api-5.0.1.zip
```
#### Kibana 5.0.0
```bash
./bin/kibana-plugin install https://github.com/Webiks/kibana-API/releases/download/5.0.0/kibana_api-5.0.0.zip
```
# Development

## Build plugin
* clone git repo in `kibana_home/plugins`
* `cd kibana_home/plugins/kibana-API`
* `npm install`

## Run unit test
`npm test`

```


