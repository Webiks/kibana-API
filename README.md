# kibana-API 0.6.1(kibana 6.5.0 and above)
Kibana-API is an extension to Kibana that lets you tap in to the dashboard management board from your app and change the visualizations dynamically.</br></br> I recommend you read all, step by step, but if you don't have patience go to [How To Use](https://github.com/Webiks/kibana-API/blob/master/README.md#how-to-use)


## Demo
![alt text](https://github.com/Webiks/kibana-API/blob/master/demo3.gif)

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

In order to create a visualization you need to call the plugin with the visualization state.
Kibana-API is able to recieve all the visualization's properties (`isFullState = true`) -  [fullState](https://github.com/Webiks/kibana-API/wiki/Full-visState).
In case you do not wish to define all the visualization's properties (`isFullState = false`), you can pass some and Kibana-API will automatically fill-in the rest. [partial visState](https://github.com/Webiks/kibana-API/wiki/Partial-visState)

[Add visualization](https://github.com/Webiks/kibana-API/wiki/Add-Visualization)    

[Replace visualization](https://github.com/Webiks/kibana-API/wiki/Replace-Visualization)    

## Filter Functions

[Filter functions](https://github.com/Webiks/kibana-API/wiki/Filter-functions)

## Index Pattern Functions

[Index pattern functions](https://github.com/Webiks/kibana-API/wiki/Index-Pattern-functions)

## Time Functions

[Time Functions](https://github.com/Webiks/kibana-API/wiki/Time-function-(in-kibana-6.x-only))


# How to Use
1) Install the plugin, look at https://github.com/Webiks/kibana-API/wiki/Installs
2) Restart Kibana
3) Index data to elasticsearch (if you have not done so before)
4) Navigate to localhost:5601 and:</br>a) Create kibana index-pattern (you can also do that with [create index pattern function](https://github.com/Webiks/kibana-API/wiki/Index-Pattern-functions)</br>b) Create dashboard</br>c) Press on the share button and copy the Embedded iframe URL to your HTML application  (don't use the save dashboard link)</br>
5) Give ID to the iframe element.
6) Look At my example :https://github.com/Webiks/kibana-API/wiki/Replace-Visualization or https://github.com/Webiks/kibana-API/wiki/Add-Visualization
7) Enjoy    


# Development

## Build plugin
* clone git repo in `kibana_home/plugins`
* `cd kibana_home/plugins/kibana-API`
* `npm install`

## Run unit test
`npm test`



## Help me to improve!:

If there's any problem or doubt, please, open a Github Issue (Pull Request) or contact me via email:
ytzhak@webiks.com. 
