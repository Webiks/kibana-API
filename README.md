# kibana-API
Kibana-API is an extension to Kibana (version ) that lets you tap in to the dashboard management board (link to picture) from your app and changing the visualizations dynamically.

## postMessage
The plugin use Window.postMessage() method (https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), to connect between the applicaion and between the kibana iframe

`var iframe = document.getElementById('Iframe');`

in javascript use:<br />
 `var iWindow=iframe.contentWindow`
 
in typescript use: <br />
 `var iWindow = (<HTMLIFrameElement>iframe).contentWindow;`
    
`iWindow.postMessage({}, '*');`

## Events
## setVisualization 
(https://github.com/Webiks/kibana-API/wiki)  

In attend to create visualization you need to call the plugin with visualization state, meaning the visualization definition,
you can send well formed kibana visState we call [fullState](https://github.com/Webiks/kibana-API/wiki/Full-visState) , and you can send [partial visState](https://github.com/Webiks/kibana-API/wiki/Partial-visState) if you don't know how exactly the visState look like.
when you send well formed visState set isFullState property to true;
when you send partial visState set isFullState property to false;

[Add visualization](https://github.com/Webiks/kibana-API/wiki/Add-Visualization)    

[Replace visualization](https://github.com/Webiks/kibana-API/wiki/Replace-Visualization)    

