var modes;
function setModes(arr)
{
modes=new Map(arr);
/*
modes.forEach(function(value,key){
alert("Key : "+key);
alert("value : "+value);
});
*/
}

var tmmvc={
"controller" : null,
"model" : null
};
var currentVal=null;
var views=null;
var currentMode="null";
var previousMode="null";
var buttons;
function loader()
{
if(tmmvc.controller.mode!=null)
{
tmmvc.controller.mode=tmmvc.controller.mode.trim();
if(tmmvc.controller.mode.length>=0)
{
if(modes.has(tmmvc.controller.mode)==false) throw "Invalid mode has been specified in controller object";
}
}
views=document.querySelectorAll("[tmmvc-if]");
var view;
var v;
var str;
var button;
var funcName;
buttons=document.querySelectorAll("button[tmmvc-click]");
for(var f=0;f<buttons.length;f++)
{
button=buttons[f];
funcName=button.getAttribute("tmmvc-click");
button.funcName=funcName;
button.onclick=function(){
var fnName=this.funcName;
var str="tmmvc.controller."+fnName+"()";
return eval(str);
};
} // for loop for buttons
for(var e=0;e<views.length;e++)
{
view=views[e];
v=view.getAttribute("tmmvc-if");
str="tmmvc.controller."+v;
if(eval(str)==false)
{
view.remove();
}
} // for loop for views
}
function changeMode(mode)
{
previousMode=tmmvc.controller.mode;
tmmvc.controller.mode=mode;
updateMode();
}
function updateMode()
{
var view;
var mode;
var str;
var strForPreviousMode;
var sp;
var ep;
var x;
for(var e=0;e<views.length;e++)
{
view=views[e];
mode=view.getAttribute("tmmvc-if");
str="tmmvc.controller."+mode;
if(eval(str))
{
document.body.append(view);
}
else
{
sp=mode.indexOf("'");
ep=mode.lastIndexOf("'");
x=mode.substring(sp+1,ep);
if(x==previousMode)
{
view.remove();
}
}
}
}

class TemplateInfo
{
constructor()
{
this.name=null;
this.values=null;
}

}
var templateValues=[];
function replaceContent(match,p1,p2,offset,c)
{
//alert(match);
//alert(p1);
var str=match.slice(2,-2);
if(str.length==0 || str==null) return "";
var m=str.match(/^(\w+)\[.*\]/);
var x=str.indexOf(".");
var result=eval("tmmvc.model."+str);
var resultString;
var len=0;
if(result!=null)
{
if((typeof result)!="string") resultString=result.toString();
else resultString=result;
len=resultString.length;
}
var templateInfo=new TemplateInfo();
if(x!=-1)
{
var objName=str.substring(0,x);
//alert("Type of "+objName+" is : "+(typeof tmmvc.model[objName]));
if((typeof tmmvc.model[objName])=='object')
{
templateInfo.name=objName;
templateInfo.value=tmmvc.model[objName];
templateValues[templateValues.length]=templateInfo;
}
}
else if(m!=null && Array.isArray(tmmvc.model[m[1]])) 
{
templateInfo.name=m[1];
templateInfo.value=tmmvc.model[m[1]];
templateValues[templateValues.length]=templateInfo;
}
else
{
templateInfo.name=str;
templateInfo.value=tmmvc.model[str];
templateValues[templateValues.length]=templateInfo;
}

//alert(result);
if(result!=null)
{
return result;
}

return "";
}
function searchContent()
{
var regex=/{{.*?}}/g;
var newString=actualContent.replace(regex,replaceContent);
//alert("New String : "+newString);
document.body.innerHTML=newString;
var templateInfo;
}
function isValuesChanged()
{
var templateInfo;
var name;
for(var e=0;e<templateValues.length;e++)
{
templateInfo=templateValues[e];
name=templateInfo.name;
if(templateInfo.value!=tmmvc.model[name]) return true;
}
return false;
}



var actualContent;

var inputs=null;
var radioButtons={};
var comboBoxCollection;
var textareaCollection;
function loader()
{
actualContent=document.body.innerHTML;
searchContent();
inputs=document.querySelectorAll("input[tmmvc-attribute]");
var name;
var bindTo;
var input;
var inputType;
for(var e=0;e<inputs.length;e++)
{
input=inputs[e];
name=input.getAttribute("tmmvc-attribute");
if(!(name in tmmvc.model)) 
{
throw name+" not found in model";
}
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(bindTo==null)
{
bindTo="value";
}
if(!(bindTo in input)) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute

inputType=input.type.toUpperCase();
if(inputType=='RADIO')
{
bindTo=null;
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(input[bindTo]==null) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute
if(bindTo==null)
{
bindTo="value";
}
if(radioButtons[name]==null) radioButtons[name]={};
if(radioButtons[name].inputs==null) radioButtons[name].inputs=new Array();
radioButtons[name].inputs[radioButtons[name].inputs.length]=input;
if(radioButtons[name].tmmvcAttributeName==null) radioButtons[name].tmmvcAttributeName=name;
if(radioButtons[name].bindTo==null) radioButtons[name].bindTo=bindTo;

if(input[bindTo]==tmmvc.model[name]) 
{
input.checked=true;
radioButtons[name].currentValue=input[bindTo];
}
input.addEventListener("change",updateModelForRadioInput);
input.tmmvcAttributeName=name;
input.tmmvcBindTo=bindTo;


} // if condition for radio input
else if(inputType=='CHECKBOX')
{
bindTo=null;
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(input[bindTo]==null) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute
if(bindTo==null)
{
bindTo="checked";
}
input[bindTo]=tmmvc.model[name];

input.tmmvcBindTo=bindTo;
input.addEventListener('input',updateModel);
input.currentVal=tmmvc.model[name];
input.tmmvcAttributeName=name;
}
else 
{
bindTo=null;
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(input[bindTo]==null) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute
if(bindTo==null)
{
bindTo="value";
}

input[bindTo]=tmmvc.model[name];
input.tmmvcBindTo=bindTo;
input.addEventListener('input',updateModel);
input.currentVal=tmmvc.model[name];
input.tmmvcAttributeName=name;
} 
}

// code for combo box 

comboBoxCollection=document.querySelectorAll("select[tmmvc-attribute]");
var options;
var comboBox;
var values;
var value;
var bindTo;
for(var e=0;e<comboBoxCollection.length;e++)
{
comboBox=comboBoxCollection[e];
options=comboBox.children;
name=comboBox.getAttribute("tmmvc-attribute");
if(!(name in tmmvc.model)) throw name+" not found in model";
values=tmmvc.model[name];
bindTo=null;
if(comboBox.hasAttribute("tmmvc-bind-to"))
{
bindTo=comboBox.getAttribute("tmmvc-bind-to");
if(!(bindTo in comboBox))
{
if(!(bindTo in options[0]))
{
throw "Invalid attribute : "+bindTo;
}
}
}

if(bindTo==null) bindTo="text";
optionAttribute=false;
if(bindTo in options[0]) optionAttribute=true;
//alert("Option attribute : "+optionAttribute);
if(values!=null)
{
if(optionAttribute)
{
if(Array.isArray(values)==false)
{
for(var f=0;f<options.length;f++)
{
option=options[f];
if(option[bindTo]==values)
{
option.selected=true;
}
}
} // if for values!=array
else
{
for(var i=0;i<values.length;i++)
{
value=values[i];
for(var f=0;f<options.length;f++)
{
option=options[f];
if(option[bindTo]==value)
{
option.selected=true;
}
}
}
} // else block for values=array

} // option attribute
if(!optionAttribute) comboBox[bindTo]=value;
} // if values !=null

comboBox.addEventListener("change",updateModelForComboBox);
comboBox.tmmvcAttributeName=name;
comboBox.currentValues=values;
comboBox.tmmvcBindTo=bindTo;
comboBox.optionAttribute=optionAttribute;
}

// code for combo box 

// code for textarea

textareaCollection=document.querySelectorAll("textarea[tmmvc-attribute]");
var textarea
var value;
var tmmvcBindTo;
for(var e=0;e<textareaCollection.length;e++)
{
textarea=textareaCollection[e];
name=textarea.getAttribute("tmmvc-attribute");
if((name in tmmvc.model)==false) 
{
throw name+" not found in model";
}
value=tmmvc.model[name];
tmmvcBindTo=null;
if(textarea.hasAttribute("tmmvc-bind-to"))
{
tmmvcBindTo=textarea.getAttribute("tmmvc-bind-to");
if(textarea[tmmvcBindTo]==null)
{
throw "Invalid attribute : "+tmmvcBindTo;
}
}

if(tmmvcBindTo==null) tmmvcBindTo="value";
textarea[tmmvcBindTo]=value;
textarea.addEventListener("input",updateModelForTextarea);
textarea.tmmvcAttributeName=name;
textarea.currentValue=value;
textarea.tmmvcBindTo=tmmvcBindTo;
}


// code for textarea

setInterval(function(){
updateView();
updateViewForRadioInput();
updateViewForComboBox();
updateViewForTextarea();
if(isValuesChanged())
{
templateValues=new Array();
searchContent();
updateDOM();
}
},1000);
}
function updateDOM()
{
inputs=document.querySelectorAll("input[tmmvc-attribute]");
var name;
var bindTo;
var input;
var inputType;
for(var e=0;e<inputs.length;e++)
{
input=inputs[e];
name=input.getAttribute("tmmvc-attribute");
if(!(name in tmmvc.model)) 
{
throw name+" not found in model";
}
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(bindTo==null)
{
bindTo="value";
}
if(!(bindTo in input)) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute

inputType=input.type.toUpperCase();
if(inputType=='RADIO')
{
bindTo=null;
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(input[bindTo]==null) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute
if(bindTo==null)
{
bindTo="value";
}
if(radioButtons[name]==null) radioButtons[name]={};
if(radioButtons[name].inputs==null) radioButtons[name].inputs=new Array();
radioButtons[name].inputs[radioButtons[name].inputs.length]=input;
if(radioButtons[name].tmmvcAttributeName==null) radioButtons[name].tmmvcAttributeName=name;
if(radioButtons[name].bindTo==null) radioButtons[name].bindTo=bindTo;

if(input[bindTo]==tmmvc.model[name]) 
{
input.checked=true;
radioButtons[name].currentValue=input[bindTo];
}
input.addEventListener("change",updateModelForRadioInput);
input.tmmvcAttributeName=name;
input.tmmvcBindTo=bindTo;


} // if condition for radio input
else if(inputType=='CHECKBOX')
{
bindTo=null;
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(input[bindTo]==null) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute
if(bindTo==null)
{
bindTo="checked";
}
input[bindTo]=tmmvc.model[name];

input.tmmvcBindTo=bindTo;
input.addEventListener('input',updateModel);
input.currentVal=tmmvc.model[name];
input.tmmvcAttributeName=name;
}
else 
{
bindTo=null;
if(input.hasAttribute("tmmvc-bind-to"))
{
bindTo=input.getAttribute("tmmvc-bind-to");
if(input[bindTo]==null) throw "Invalid attribute : "+bindTo;
} // if condition for bind to attribute
if(bindTo==null)
{
bindTo="value";
}

input[bindTo]=tmmvc.model[name];
input.tmmvcBindTo=bindTo;
input.addEventListener('input',updateModel);
input.currentVal=tmmvc.model[name];
input.tmmvcAttributeName=name;
} 
}

// code for combo box 

comboBoxCollection=document.querySelectorAll("select[tmmvc-attribute]");
var options;
var comboBox;
var values;
var value;
var bindTo;
for(var e=0;e<comboBoxCollection.length;e++)
{
comboBox=comboBoxCollection[e];
options=comboBox.children;
name=comboBox.getAttribute("tmmvc-attribute");
if(!(name in tmmvc.model)) throw name+" not found in model";
values=tmmvc.model[name];
bindTo=null;
if(comboBox.hasAttribute("tmmvc-bind-to"))
{
bindTo=comboBox.getAttribute("tmmvc-bind-to");
if(!(bindTo in comboBox))
{
if(!(bindTo in options[0]))
{
throw "Invalid attribute : "+bindTo;
}
}
}

if(bindTo==null) bindTo="text";
optionAttribute=false;
if(bindTo in options[0]) optionAttribute=true;
//alert("Option attribute : "+optionAttribute);
if(values!=null)
{
if(optionAttribute)
{
if(Array.isArray(values)==false)
{
for(var f=0;f<options.length;f++)
{
option=options[f];
if(option[bindTo]==values)
{
option.selected=true;
}
}
} // if for values!=array
else
{
for(var i=0;i<values.length;i++)
{
value=values[i];
for(var f=0;f<options.length;f++)
{
option=options[f];
if(option[bindTo]==value)
{
option.selected=true;
}
}
}
} // else block for values=array

} // option attribute
if(!optionAttribute) comboBox[bindTo]=value;
} // if values !=null

comboBox.addEventListener("change",updateModelForComboBox);
comboBox.tmmvcAttributeName=name;
comboBox.currentValues=values;
comboBox.tmmvcBindTo=bindTo;
comboBox.optionAttribute=optionAttribute;
}

// code for combo box 

// code for textarea

textareaCollection=document.querySelectorAll("textarea[tmmvc-attribute]");
var textarea
var value;
var tmmvcBindTo;
for(var e=0;e<textareaCollection.length;e++)
{
textarea=textareaCollection[e];
name=textarea.getAttribute("tmmvc-attribute");
if((name in tmmvc.model)==false) 
{
throw name+" not found in model";
}
value=tmmvc.model[name];
tmmvcBindTo=null;
if(textarea.hasAttribute("tmmvc-bind-to"))
{
tmmvcBindTo=textarea.getAttribute("tmmvc-bind-to");
if(textarea[tmmvcBindTo]==null)
{
throw "Invalid attribute : "+tmmvcBindTo;
}
}

if(tmmvcBindTo==null) tmmvcBindTo="value";
textarea[tmmvcBindTo]=value;
textarea.addEventListener("input",updateModelForTextarea);
textarea.tmmvcAttributeName=name;
textarea.currentValue=value;
textarea.tmmvcBindTo=tmmvcBindTo;
}


// code for textarea


}
function updateView()
{
var input;
for(var e=0;e<inputs.length;e++)
{
input=inputs[e];
if(input.type.toUpperCase()=="RADIO") continue;
var newVal=tmmvc.model[input.tmmvcAttributeName];
if(input.currentVal!=newVal)
{
input[input.tmmvcBindTo]=newVal;
input.currentVal=newVal;
}
}
}

function updateModel()
{
tmmvc.model[this.tmmvcAttributeName]=this[this.tmmvcBindTo];
this.currentVal=this[this.tmmvcBindTo];
}
function updateModelForComboBox()
{
var values=[];
if(!(this.optionAttribute)) values=this[this.tmmvcBindTo];
else
{
var selectedOptions=this.selectedOptions;
for(var e=0;e<selectedOptions.length;e++)
{
values[values.length]=selectedOptions[e][this.tmmvcBindTo];
}
}
tmmvc.model[this.tmmvcAttributeName]=values;
this.currentValues=values;
}
function updateModelForTextarea()
{
var value;
value=this[this.tmmvcBindTo];
var name=this.tmmvcAttributeName;
tmmvc.model[name]=value;
this.currentValue=value;
}
function updateViewForRadioInput()
{
var radioButton;
var name;
var newValue;
var currentValue;
var inputs;
var input;
for(k in radioButtons)
{
radioButton=radioButtons[k];
name=radioButton.tmmvcAttributeName;
currentValue=radioButton.currentValue;
newValue=tmmvc.model[name];
if(currentValue!=newValue)
{
// updateView
inputs=radioButton.inputs;
for(var e=0;e<inputs.length;e++)
{
input=inputs[e];
input.checked=false;
if(input[input.tmmvcBindTo]==newValue) input.checked=true;
}
currentValue=newValue;
}
}


}

function updateModelForRadioInput()
{
// update model
var name=this.tmmvcAttributeName;
tmmvc.model[name]=this[this.tmmvcBindTo];
radioButtons[name].currentValue=this[this.tmmvcBindTo];
}
function updateViewForComboBox()
{
var comboBox;
var newValues;
var name;
var newValue;
var currentValues;
var options;
var option;
var valuesChanged;
for(var e=0;e<comboBoxCollection.length;e++)
{
valuesChanged=false;
comboBox=comboBoxCollection[e];
name=comboBox.tmmvcAttributeName;
currentValues=comboBox.currentValues;
newValues=tmmvc.model[name];
//alert("Values from view : "+currentValues);
//alert("Values from model : "+newValues);
if(!(comboBox.optionAttribute))
{
if(currentValues!=newValues) valuesChanged=true;
}
else
{
//alert("Values from view : "+currentValues);
//alert("Values from model : "+newValues);
//alert(currentValues==newValues);
if(currentValues==newValues) valuesChanged=false;
if(currentValues==null || newValues==null) valuesChanged=true;
else if(currentValues.length!=newValues.length) valuesChanged=true;
else
{
for(var i=0;i<newValues.length;i++)
{
newValue=newValues[i];
//alert("New value : "+newValue);
//alert("Current values : "+currentValues)
if(currentValues.includes(newValue)==false)
{
valuesChanged=true;
break;
}
}
}
}


if(valuesChanged)
{
bindTo=comboBox.tmmvcBindTo;
if(!(comboBox.optionAttribute))
{
comboBox[bindTo]=newValues;
}
else
{
options=comboBox.options;
comboBox.selectedOptions=[];
for(var i=0;i<options.length;i++)
{
option=options[i];
value=option[bindTo];
option.selected=false;
if(newValues!=null) if(newValues.includes(value))
{
option.selected=true;
comboBox.selectedOptions[comboBox.selectedOptions.length]=option;
}
}
}
comboBox.currentValues=newValues;


} // values changed
}
}
function updateViewForTextarea()
{
var textarea;
var name;
var newValue;
var currentValue;
var bindTo;
for(var e=0;e<textareaCollection.length;e++)
{
textarea=textareaCollection[e];
name=textarea.tmmvcAttributeName;
bindTo=textarea.tmmvcBindTo;
newValue=tmmvc.model[name];
currentValue=textarea.currentValue;
if(currentValue!=newValue)
{
textarea[bindTo]=newValue;
textarea.currentValue=newValue;
} // value changed
} // loop on textarea ends here

}


window.addEventListener('load',loader);
