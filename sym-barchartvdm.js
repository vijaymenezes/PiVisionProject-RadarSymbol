(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "barchartvdm",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function(){ 
			return { 
				DataShape: 'Table',
				Height: 150,
				Width: 150,
				BackgroundColor: '#344c69',
				BorderRadius: 50				
			} 
		},
		configOptions: function () { 
			return [{ 
				title: "Format Symbol",
				mode: "format" 
			}];
		}
	}

	function getConfig(){
		return {
			"type": "radar",
	"categoryField": "attribute",
	"startDuration": 1,
	"color": "#FFFFFF",
	"graphs": [
		{
			"balloonText": "[[category]]:[[value]]",
			"bullet": "round",
			"id": "AmGraph-1",
			"valueField": "value"
		}
	],
	"guides": [],
	"valueAxes": [
		{
			"axisTitleOffset": 20,
			"id": "ValueAxis-1",
			"minimum": 0,
			"axisAlpha": 0.15,
			"dashLength": 3
		}
	],
	"allLabels": [],
	"balloon": {},
	"titles": [],
	"dataProvider": []
		}
	}
	
	symbolVis.prototype.init = function(scope, elem) { 
		this.onDataUpdate = dataUpdate;
		var labels;
		
		var container = elem.find('#container')[0];
		container.id = "barChart_" + scope.symbol.Name;
		var chart = AmCharts.makeChart(container.id, getConfig());
		function converttoChart(data){
			return data.Rows.map(function(item,index){
				var i = labels[index].indexOf("|"); 	//Getting Index of '|' char
				var lab = labels[index].substr(i+1);	//getting substring after '|'
				return{
					value:item.Value,
					attribute:lab
				}
			});
		}
		
		function updateLabel(data){
			labels = data.Rows.map(function(item){
				return item.Label;
			});
		}
		
		function dataUpdate(data){
			console.log(data);
			if( !data) return;
			if(data.Rows[0].Label) updateLabel(data);
			if(!labels || !chart) return;
			
			var dataprovider = converttoChart(data);
			chart.dataProvider= dataprovider;
			chart.validateData();
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
