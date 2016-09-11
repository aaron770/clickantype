
/*
*need to add "sites","contacts","pass", 
*maybe tab can get working need to add it to json pagenavigation
*
*how I would structure the switch
*it would have objects for states "url""button","mail","links""checkbox","list","date","radio""click","submit","search"
*it would pass the element back and we would perform the hightligh and focus and set scope.lastfocust on elment in stragdegy pattern
*ouch that would have been easy just make sure everything is same type of element and ready to be used
*/
window.addEventListener("load", function() {


	if (typeof angular == 'undefined') {
			  var ang = document.createElement('script'); ang.type = 'text/javascript';
			  
			  ang.src = 'angular.js';
			  document.getElementsByTagName('head')[0].appendChild(ang);
			  //( document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] ).appendChild( script )
	}


		
	  var app = angular.module('Binged', []);

	  var html = document.querySelector('html');
	  //html.setAttribute('ng-app', 'Binged');
	  //html.setAttribute('ng-csp', '');
/*function change() {
    var appElement = document.querySelector('[ng-app=myApp]');
    var $scope = angular.element(appElement).scope();
    $scope.$apply(function() {
        $scope.data.age = 20;
    });
}*/
//var body = document.getElementsByTagName('body')[0];
    	  

	
var body = document.querySelector('body');

	var typeAnClickKeyboard = document.createElement('div');
    //typeAnClickKeyboard.setAttribute('ng-controller', 'mainController');
    typeAnClickKeyboard.setAttribute('id', 'theKeybordSpace');
    typeAnClickKeyboard.setAttribute('ng-controller', 'mainController');  
    typeAnClickKeyboard.setAttribute('my-directive', '');
    body.appendChild(typeAnClickKeyboard);

    var locationField = document.createElement('div');
    locationField.setAttribute('id', 'theSearchSpace');
    
    $(locationField).html(
'<form method="get" action="https://www.google.com/search">'+
    '<input type="text" id="searchgoogle" name="q" size="31" value="">'+    
'</form>');
    body.appendChild(locationField);
	//body.setAttribute('ng-controller', 'mainController');
	//body.setAttribute('ng-click','clickToSelect()');

angular.element(body).click(function(){
    	var appElement = document.querySelector('[ng-controller=mainController]');
	    var $scope = angular.element(appElement).scope();
	    $scope.$apply(function() {
			$scope.clickToSelect();
		});
    });


  app.directive('myDirective', [ '$sce', function($sce) {
    return {
      restrict: 'EA', 
      replace: true,
      templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('toolbar.html'))
    };
  }]);

/*
var keybrd = document.querySelector('typeAnClickKeyboard');
var keybrdscp = angular.element(keybrd).scope();
$compile(body)(keybrdscp);
*/

//var theLanguage = 'english';
app.factory('jsonLanguage', ['$http' ,function($http){
	//var theLanguage = 'english';
	return {

		get: function(theLanguage){
			var url = theLanguage + '.json';
			//var url = 'english.json';
			return $http.get(chrome.extension.getURL(url), true);
		}
	}

}]);
/*['$scope', 'Photo', function ($scope, Photo) {
        $scope.photos = Photo.query();
    }])*/
app.controller('mainController', ['$scope', '$http', '$log', '$compile', 'jsonLanguage', '$interval', function($scope, $http, $log, $compile, jsonLanguage, $interval) {
	
  $scope.language;
//$log.log($scope.language[0].rows);
  $scope.theLanguage = "english";
    jsonLanguage.get($scope.theLanguage).then(function(res){
        $scope.language = res.data;
		$log.log($scope.language[0].rows);
    });
    

    
    $scope.letterSelectedForText = "";
    $scope.rowOrcolumn = "row";
    $scope.rowSelected = 0;
    $scope.columnSelected = 0;
    $scope.navigationState = "text";
    //"url""button","mail","links""checkbox","list","date","radio""click","submit","search"
    $scope.navigationIndex = 0;
    
	//whereToTypeElement
	$scope.lastFocused;

  angular.element("input[type='text'], input[type='url'], input[type='email'], input[type='password'], input[type='search'], input[type='tel'], textarea, div[contenteditable='true']").focus(function() {
  	
    $scope.lastFocused = document.activeElement;
  });
  $(document).on('DOMNodeInserted', function(e) {
  	angular.element("input[type='text'], input[type='url'], input[type='email'], input[type='password'], input[type='search'], input[type='tel'], textarea, div[contenteditable='true']").focus(function() {
  	
    $scope.lastFocused = document.activeElement;
  })
  });
//console.log($('aZ'))
 // $('aZ').css( "cursor", "none" );

  $scope.insertText = function(text) {
    var input = $scope.lastFocused;
    console.log(input);//
    if (input == undefined) { return; }
    if ( angular.element(input).attr('type') == "email" || angular.element(input).attr('type') == "date") {
		input.value += text;
    	return;
    }
    if (angular.element(input).attr('contenteditable') == "true" ){
            input.innerHTML += text;
            return;
    }
    var scrollPos = input.scrollTop;
    var pos = input.selectionStart;
    var front = (input.value).substring(0, pos);  
    var back = (input.value).substring(pos, input.value.length); 
    input.value = front+text+back;
    pos = pos + text.length;    
    input.scrollTop = scrollPos;
    console.log(angular.element(input).val());
    angular.element(input).trigger('input');
    

 };
 //"rows":[["/|\\","\\|/","-->","<--","<<-","->>"["url","text","button","mail","links"],["checkbox","list","date","radio","links"],["click","submit","search"],["sites","contacts","pass","bck*"]
 $scope.doSpeacialAction = function(text) {
 	switch(text) {
 		case "spc":
 			return $scope.insertText(" ");
 		case "und":
 		var input = $scope.lastFocused;
 		angular.element(input).val(angular.element(input).val().slice(0,-1));
 		//$('#myarea').val( $("myarea").val().slice(0,-1) );
 		    break;
 		case "chr":
 		    $scope.theLanguage = "speciChara";
 		    jsonLanguage.get($scope.theLanguage).then(function(res){
		        $scope.language = res.data;
				$log.log($scope.language[0].rows);
		    });
		    $scope.navigationIndex = 0; 
 		    break;
 		case "num":
 		    $scope.theLanguage = "numbers";
 		     jsonLanguage.get($scope.theLanguage).then(function(res){
		        $scope.language = res.data;
				$log.log($scope.language[0].rows);
		    });
 		     $scope.navigationIndex = 0;
 		    break;
 		case "nav":
 		    $scope.theLanguage = "pageNavigation";
 		    jsonLanguage.get($scope.theLanguage).then(function(res){
		        $scope.language = res.data;
				$log.log($scope.language[0].rows);
			});
			$scope.navigationIndex = 0;
		    break;
		case "bck":
		$scope.theLanguage = $scope.language[0].language;
            console.log($scope.language[0].language);
            jsonLanguage.get($scope.theLanguage).then(function(res){
		        $scope.language = res.data;
				$log.log($scope.language[0].rows);
			});
			$scope.navigationState = "text";
			$scope.navigationIndex = 0;
		    break;

		case  "click":
		//I should not need this it should just be $scope.lastFocused.click()
		if ($scope.navigationState == "emailInbox") {
			document.getElementsByClassName('zA')[$scope.navigationIndex].click();
			return; 
		} 
		break;
		
		break;
		case "/|\\":
		console.log("Hello"+ text);
		window.scrollBy(0, -100);
		
		    break;
		case "\\|/":
		console.log("Hello" +text);
		
		window.scrollBy(0, 100);
		    break;
		case "-->":
		//console.log("Hello"+ text);
		if ($scope.navigationState  == "emailInbox") {
             //if ($scope.navigationIndex < document.getElementsByClassName('zA').length) {}
             document.getElementsByClassName('zA')[$scope.navigationIndex].removeAttribute("style");
             $scope.navigationIndex += 1;
             document.getElementsByClassName('zA')[$scope.navigationIndex].style.color = "blue";
             document.getElementsByClassName('zA')[$scope.navigationIndex].focus();
             $scope.lastFocused = document.activeElement;
			return ;
		} 
		if ($scope.navigationState == "allLinks") {
               //if ($scope.navigationIndex > 0) {
               	document.getElementsByTagName("A")[$scope.navigationIndex].removeAttribute("style");
               	$scope.navigationIndex+= 1;
                  document.getElementsByTagName("A")[$scope.navigationIndex].style.color = "blue";
                  document.getElementsByTagName("A")[$scope.navigationIndex].focus();
                  $scope.lastFocused = document.activeElement;
			      break;
			   //}
			break;
		}
		if ($scope.navigationState == "allCheckBoxes") {
               //if ($scope.navigationIndex > 0) {
               	document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].removeAttribute("style");
               	$scope.navigationIndex+= 1;
                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].style.color = "blue";
                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].focus();
                  $scope.lastFocused = document.activeElement;
			      break;
			   //}
			break;
		}
		if ($scope.navigationState == "allList") {
               //if ($scope.navigationIndex > 0) {
               document.getElementsByTagName("LI")[$scope.navigationIndex].removeAttribute("style");
               	$scope.navigationIndex += 1;
                  document.getElementsByTagName("LI")[$scope.navigationIndex].style.color = "blue";
                  document.getElementsByTagName("LI")[$scope.navigationIndex].focus()
                  $scope.lastFocused = document.activeElement;
			      break;
			   //}
			break;
		} 
		if ($scope.navigationState == "allButtons") {
               //if ($scope.navigationIndex > 0) {
               	document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].removeAttribute("style");
               	$scope.navigationIndex += 1;
                  document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].style.color = "blue";
                  document.getElementsByTagName("LI")[$scope.navigationIndex].focus();
                  $scope.lastFocused = document.activeElement;
			      break;
			   //}
			break;
		}
		if ($scope.navigationState == "allDateElements") {
               //if ($scope.navigationIndex > 0) {
               	document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].removeAttribute("style");
               	$scope.navigationIndex += 1;
                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].style.color = "blue";
                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].focus();
                  $scope.lastFocused = document.activeElement;
			      break;
			   //}
			break;
		}
		if ($scope.navigationState == "allRadio") {
               //if ($scope.navigationIndex > 0) {
               	document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].removeAttribute("style");
               	$scope.navigationIndex += 1;
                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].style.color = "blue";
                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].focus();
                  $scope.lastFocused = document.activeElement;
			      break;
			   //}
			break;
		}
			break;
		case "<--":
			if ($scope.navigationState == "emailInbox") {
	               if ($scope.navigationIndex > 0) {
	               	document.getElementsByClassName('zA')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex-= 1;
	                  document.getElementsByClassName('zA')[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByClassName('zA')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allLinks") {
	               if ($scope.navigationIndex > 0) {
	               	document.getElementsByTagName("A")[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex-= 1;
	                  document.getElementsByTagName("A")[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByTagName("A")[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allCheckBoxes") {
	               if ($scope.navigationIndex > 0) {
	               	document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex-= 1;
	                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allList") {
	               if ($scope.navigationIndex > 0) {
	               document.getElementsByTagName("LI")[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex-= 1;
	                  document.getElementsByTagName("LI")[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByTagName("LI")[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			} 
			if ($scope.navigationState == "allButtons") {
	               if ($scope.navigationIndex > 0) {
	               	document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex-= 1;
	                  document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allDateElements") {
	               if ($scope.navigationIndex > 0) {
	               	document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex-= 1;
	                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allRadio") {
	               if ($scope.navigationIndex > 0) {
	               	document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex-= 1;
	                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			//console.log("Hello" +text);
				break;
		case "<<-":
			if ($scope.navigationState = "emailInbox") {
	               if ($scope.navigationIndex > 2) {
	               	document.getElementsByClassName('zA')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex -= 3;
	                  document.getElementsByClassName('zA')[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByClassName('zA')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				}
				if ($scope.navigationState == "allLinks") {
	               if ($scope.navigationIndex > 2) {
	               	document.getElementsByTagName("A")[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex -= 3;
	                  document.getElementsByTagName("A")[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByTagName("A")[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allCheckBoxes") {
	               if ($scope.navigationIndex > 2) {
	               	document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex -= 3;
	                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allList") {
	               if ($scope.navigationIndex > 2) {
	               document.getElementsByTagName("LI")[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex -= 3;
	                  document.getElementsByTagName("LI")[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByTagName("LI")[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			} 
			if ($scope.navigationState == "allButtons") {
	               if ($scope.navigationIndex > 2) {
	               	document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex -= 3;
	                  document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allDateElements") {
	               if ($scope.navigationIndex > 2) {
	               	document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex -= 3;
	                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allRadio") {
	               if ($scope.navigationIndex > 2) {
	               	document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex -= 3;
	                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			}//"url""button","mail","links""checkbox","list","date","radio""click","submit","search"
			console.log("Hello"+ text);
				break;
		case "->>":
			if ($scope.navigationState = "text" == "emailInbox") {
				var listEmails = document.getElementsByClassName('zA');
	               if ($scope.navigationIndex > listEmails.length - 3) {
	               	document.getElementsByClassName('zA')[$scope.navigationIndex].removeAttribute("style")
	               	$scope.navigationIndex += 3;
	                  document.getElementsByClassName('zA')[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByClassName('zA')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				}
			}
			if ($scope.navigationState == "allLinks") {
	               var allLinks = document.getElementsByTagName("A");
	               if ($scope.navigationIndex > allLinks.length - 3) {
	               	document.getElementsByTagName("A")[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex+= 1;
	                  document.getElementsByTagName("A")[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByTagName("A")[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allCheckBoxes") {
	               var allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
	               if ($scope.navigationIndex > allCheckBoxes.length - 3) {
	               	document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex+= 1;
	                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="checkbox"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allList") {
	               var allLists = document.getElementsByTagName("LI");
	               if ($scope.navigationIndex > allLists.length - 3) {
	               document.getElementsByTagName("LI")[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex += 1;
	                  document.getElementsByTagName("LI")[$scope.navigationIndex].style.color = "blue";
	                  document.getElementsByTagName("LI")[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			} 
			if ($scope.navigationState == "allButtons") {
	               var allButtons = document.querySelectorAll('input[type="button"]');
	               if ($scope.navigationIndex > allButtons.length - 3) {
	               	document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex += 1;
	                  document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="button"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allDateElements") {
	               var allDateElements = document.querySelectorAll('input[type="date"]');
	               if ($scope.navigationIndex > allDateElements.length - 3) {
	               	document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex += 1;
	                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="date"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}
			if ($scope.navigationState == "allRadio") {
	               var allRadios = document.querySelectorAll('input[type="radio"]');
	               if ($scope.navigationIndex > allRadios.length - 3) {
	               	document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].removeAttribute("style");
	               	$scope.navigationIndex += 1;
	                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].style.color = "blue";
	                  document.querySelectorAll('input[type="radio"]')[$scope.navigationIndex].focus();
	                  $scope.lastFocused = document.activeElement;
				      break;
				   }
				break;
			}

				console.log("Hello" +text);
			    break;	
		case "button":
           $scope.navigationState  = "allButtons";
			console.log("Hello" +text);
		    break;	
		case "mail":
		    $scope.navigationState  = "emailInbox";
		    if (document.getElementsByClassName('zA')[$scope.navigationIndex]) {
             document.getElementsByClassName('zA')[$scope.navigationIndex].style.color = "blue";
             document.getElementsByClassName('zA')[$scope.navigationIndex].focus();
             $scope.lastFocused = document.activeElement;
			console.log("Hello" +text);
			}
		    break;	
		case "links":
		    	$scope.navigationState  = "allLinks";
			console.log("Hello" +text);
		    break;	
		case "checkbox":
		    	$scope.navigationState  = "allCheckBoxes";
			console.log("Hello" +text);
		    break;	
		case "list":
		    		$scope.navigationState  = "allList";
			console.log("Hello" +text);
		    break;	
		case "date":
		    	$scope.navigationState  = "allDateElements";
			console.log("Hello" +text);
		    break;	
	    case "radio":
		    		$scope.navigationState  = "allRadio";
				console.log("Hello" +text);
		    break;

		case "enter":
		    /*var ev = document.createEvent('KeyboardEvent');
			// Send key '13' (= enter)
			ev.initKeyEvent(
			    'keydown', true, true, window, false, false, false, false, 13, 0);
			document.body.dispatchEvent(ev);*/
			/*var e = jQuery.Event("keypress");
			e.which = 13; //choose the one you want
			e.keyCode = 13;
			$($scope.lastFocused).trigger(e);*/
			$scope.lastFocused.click();
		   break;
		case "submit":
		 $scope.lastFocused.form.submit();
					
		   break;
		case "search":
					$scope.lastFocused = document.getElementById("searchgoogle");			
			break;
		case "tab"://9

			/*var ev = document.createEvent('KeyboardEvent');
			// Send key '13' (= enter)
			ev.initKeyEvent(
			    'keydown', true, true, window, false, false, false, false, 9, 0);
			document.getElementById('theSearchSpace').dispatchEvent(ev);*/
				var e = jQuery.Event("keypress");
			e.which = 9; //choose the one you want
			e.keyCode = 9;
			angular.element($scope.lastFocused).trigger(e);
			break;
		   break;

		case "pbck":
			   history.go(-1);
		   break;
		default:
		    break;
 }
}

	$scope.callAtInterval = function() {
        //console.log("$scope.callAtInterval - Interval occurred");
        if ($scope.rowOrcolumn == "row") {
        	if($scope.rowSelected == $scope.language[0].rows.length - 1) {
        		$scope.rowSelected = 0;

        	}else{
			$scope.rowSelected = $scope.rowSelected + 1;
		}
			//console.log($scope.language[$scope.rowSelected]);
		}else if($scope.rowOrcolumn == "column"){
			if ($scope.columnSelected == $scope.language[0].rows[$scope.rowSelected].length -1 ) {//$scope.language.rows[0][$scope.rowSelected].length - 1
				//console.log($scope.language.rows[$scope.rowSelected]);
				//console.log($scope.language[0].rows[$scope.rowSelected]);
				$scope.columnSelected = 0;
				if($scope.rowSelected == $scope.language[0].rows.length - 1) {
        		$scope.rowSelected = 0;
        		$scope.rowOrcolumn = "row";

        	}else{
			$scope.rowSelected = $scope.rowSelected + 1;
				$scope.rowOrcolumn = "row";
				//$log.log("end of column");
				
			}
		}
			else {
				$scope.columnSelected = $scope.columnSelected + 1;
				//$log.log("add one column");
			}
		 }
    };
//onclick switch rowOrColumn
	
     
    $scope.clickToSelect = function(){
        
        if ($scope.rowOrcolumn == "row") {

			$scope.rowOrcolumn = "column";

		}else if($scope.rowOrcolumn == "column"){
			    var letterSelected = $scope.language[0].rows[$scope.rowSelected][$scope.columnSelected];
			    if (letterSelected.length > 2) {
			    	//console.log(letterSelected + "this is too long");
			    	$scope.doSpeacialAction(letterSelected);
			    } else {

				$scope.letterSelectedForText += letterSelected;

				$scope.insertText(letterSelected);
				console.log($scope.letterSelectedForText);
				};
				//reset
				$scope.rowOrcolumn = "row";
				$scope.rowSelected = 0;
				$scope.columnSelected = 0;		    
	    };
	};
    $scope.isRowSelected = function( rowIndex ) {
    	if ($scope.rowOrcolumn == "row" && rowIndex == $scope.rowSelected) {
    		return true;
    	} else {
    		return false;
    	}
    	

    };
    $scope.isColumnRowSelected = function(rowIndex, columnIndex) {
    	if ($scope.rowOrcolumn == "column" && rowIndex == $scope.rowSelected && columnIndex == $scope.columnSelected) {
    	//console.log("rowindex" + rowIndex + $scope.rowSelected + "columnIndex" +columnIndex + $scope.columnSelected);
    	return true;
		}else {
    		return false;
    	}
    };
    $scope.timeOfInterval = 2000;
$interval($scope.callAtInterval, $scope.timeOfInterval);
}]);
var connector = document.querySelector('#theKeybordSpace') 
angular.bootstrap(connector, ['Binged'], []);

});

