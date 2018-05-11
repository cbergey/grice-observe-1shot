// Simple study demonstrating the use of a tablet-designed webpage. 
// Study is designed using simple JS/HTML/CSS, with data saves to a server
// controlled by call to a short php script. 

// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

// must be a multiple of 4 
var numtrials = 1;

var squarewidth = 20; 

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

function updateText(value) {
	$("#sliderlabel").html(value + "%");
}


//currently not called; could be useful for reaction time?
getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}



// STIMULI AND TRIAL TYPES

var shapes = ["1","2","3","4","5"];

var colors = ["red", "blue", "green", "purple"];

var words = [["dax","daxes"], ["blicket","blickets"], ["wug","wugs"], ["toma", "tomas"], ["gade", "gades"], ["sprock", "sprocks"]];

var trialtypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
// Evens have color in prompt, odds don't.
// 1-6 have grey training; 7-12 have 33% targetcolor training; 13-18 have 66% targetcolor training
// 1,2,7,8,13,14 have monochrome
// 3,4,9,10,15,16 have polychrome
// 5,6,11,12,17,18 have sedivy



//-----------------------------------------------

showSlide("prestudy");

// MAIN EXPERIMENT
var experiment = {

	subid: "",

	counter: 1,

	trialtype: 0,

	percentage: 0,

	observationtype: "",

	colorasked: "",

	searchtype: "",

	targetshape: "",

	targetcolor: "",

	targetword: "",

	distractorshape1: "",

	distractorshape2: "",

	distractorcolor1: "",

	distractorcolor2: "",

	numclicks: 0,
		
	date: getCurrentDate(),
		//the date of the experiment
	timestamp: getCurrentTime(),
		//the time that the trial was completed at 

	shapes: [],

	colors: [],

	words: [],

	trialtypes: [],

	rttrain: [],

	rtsearch: [],

	rttest: [],

	data: [],

	attnselected: "",

	targetpos: 0,


	preStudy: function() {

		document.body.style.background = "white";
		$("#prestudy").hide();
		setTimeout(function () {
			experiment.start();
		}, 100);
	},


	//the end of the experiment
    end: function () {
    	setTimeout(function () {
    		$("#stage").fadeOut();
    	}, 100);
    	
    	setTimeout(function() { turk.submit(experiment, true) }, 1500);
    	showSlide("finish");
    	document.body.style.background = "black";
    },

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.counter + "," + experiment.trialtype + "," + experiment.percentage;
		dataforRound += "," + experiment.observationtype + "," + experiment.colorasked;
		dataforRound += "," + experiment.searchtype + "," + experiment.targetshape + "," + experiment.targetcolor;
		dataforRound += "," + experiment.distractorshape1 + "," + experiment.distractorshape2 + "," + experiment.distractorcolor1 + "," + experiment.distractorcolor2;
		dataforRound += "," + experiment.numclicks;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.rttrain +  "," + experiment.rtsearch + "," + experiment.rttest + "\n";
		dataforRound += "," + experiment.attnselected + "," + experiment.targetpos;
		experiment.data.push(dataforRound);	
	},

	attnCheck: function() {

		attnwords = [experiment.targetword[0], experiment.words.pop()[0], experiment.words.pop()[0], experiment.words.pop()[0]];
		attnwords = shuffle(attnwords);

        for(i=0;i<attnwords.length;i++){
            thisOne = attnwords[i];
            $("#attnCheckResponses").append("<input class='attnAnswer' type=radio name='foo' id=" +thisOne+ ">")
            $("#attnCheckResponses").append("<label for=" +thisOne+ "> " +thisOne+ " </label><br>")
        }

        showSlide("attnCheck")

        $("#attnCheckButton").click(function(){
            $('.attnAnswer').each(function(){
                if(this.checked){
                	experiment.attnselected = this.id;              
                }
            })
            experiment.processOneRow();
            experiment.end() 
        })
    },
	

	// MAIN DISPLAY FUNCTION
  	next: function(phase) {
  		$("#sliderlabel").hide();
  		$("#selector").hide();
  		$("#target").hide();
  		$("#distractor1").hide();
  		$("#distractor2").hide();

 
  		if (experiment.counter > (numtrials)) {
			experiment.attnCheck();
			return;
		}

		experiment.trialtype = experiment.trialtypes[experiment.counter - 1];

		if (experiment.trialtype == 1 || experiment.trialtype == 2 || 
			experiment.trialtype == 3 || experiment.trialtype == 4 || 
			experiment.trialtype == 5 || experiment.trialtype == 6) {
			experiment.observationtype = "grey";
		} else if (experiment.trialtype == 7 || experiment.trialtype == 8 || 
			experiment.trialtype == 9 || experiment.trialtype == 10 || 
			experiment.trialtype == 11 || experiment.trialtype == 12) {
			experiment.observationtype = "33";
		} else if (experiment.trialtype == 13 || experiment.trialtype == 14 || 
			experiment.trialtype == 15 || experiment.trialtype == 16 || 
			experiment.trialtype == 17 || experiment.trialtype == 18) {
			experiment.observationtype = "66";
		}

		if (experiment.trialtype == 1 || experiment.trialtype == 2 || 
			experiment.trialtype == 7 || experiment.trialtype == 8 || 
			experiment.trialtype == 13 || experiment.trialtype == 14) {
			experiment.searchtype = "monochrome";
		} else if (experiment.trialtype == 3 || experiment.trialtype == 4 || 
			experiment.trialtype == 9 || experiment.trialtype == 10 || 
			experiment.trialtype == 15 || experiment.trialtype == 16) {
			experiment.searchtype = "polychrome";
		} else if (experiment.trialtype == 5 || experiment.trialtype == 6 || 
			experiment.trialtype == 11 || experiment.trialtype == 12 || 
			experiment.trialtype == 17 || experiment.trialtype == 18) {
			experiment.searchtype = "sedivy";
		}

		if (experiment.trialtype%2 == 0) {
			experiment.colorasked = true;
		} else {
			experiment.colorasked = false;
		}

		console.log(phase)

		if (phase == "train") {
			$("#instructions").hide();
			$("#testingstage").hide();

  			experiment.targetword = experiment.words.pop();

  			experiment.targetshape = experiment.shapes.pop();
  			experiment.targetcolor = experiment.colors.pop();

  			console.log(experiment.observationtype);
			
  			if (experiment.observationtype == "grey") {
  				$("#object1").attr("src", "stim-images/object" + experiment.targetshape + "grey.jpg");
				$("#object2").attr("src", "stim-images/object" + experiment.targetshape + "grey.jpg");
				$("#object3").attr("src", "stim-images/object" + experiment.targetshape + "grey.jpg");
				$("#instructions").html("The " + experiment.targetword[0] + " tree makes " + experiment.targetword[1] + ", but these " + experiment.targetword[1] + " have lost their color. Look at the " + experiment.targetword[1] + ".");
  			} else if (experiment.observationtype == "33") {
  				var distractorcolor = experiment.colors.pop();
  				var colors = [experiment.targetcolor, distractorcolor, distractorcolor];
  				colors = shuffle(colors);
  				$("#object1").attr("src", "stim-images/object" + experiment.targetshape + colors[0] + ".jpg");
				$("#object2").attr("src", "stim-images/object" + experiment.targetshape + colors[1] + ".jpg");
				$("#object3").attr("src", "stim-images/object" + experiment.targetshape + colors[2] + ".jpg");
				$("#instructions").html("The " + experiment.targetword[0] + " tree makes " + experiment.targetword[1] + ". Look at the " + experiment.targetword[1] + ".");
  			} else if (experiment.observationtype == "66") {
  				var distractorcolor = experiment.colors.pop();
  				var colors = [experiment.targetcolor, experiment.targetcolor, distractorcolor];
  				colors = shuffle(colors);
  				$("#object1").attr("src", "stim-images/object" + experiment.targetshape + colors[0] + ".jpg");
				$("#object2").attr("src", "stim-images/object" + experiment.targetshape + colors[1] + ".jpg");
				$("#object3").attr("src", "stim-images/object" + experiment.targetshape + colors[2] + ".jpg");
				$("#instructions").html("The " + experiment.targetword[0] + " tree makes " + experiment.targetword[1] + ". Look at the " + experiment.targetword[1] + ".");
  			}


			$("#object1").show();
			$("#object2").show();
			$("#object3").show();

	    	$("#instructions").show();

		    $("#trainingstage").fadeIn();

		    experiment.starttime = Date.now();


		} else if (phase == "search") {
			experiment.numclicks = 0;
			$("#sselector").hide();
			$("#instructions").hide();
			$("#trainingstage").hide();
			$("#object1").hide();
			$("#object2").hide();
			$("#object3").hide();

			clickDisabled = true;
  	 		$( "#totestbutton" ).attr('disabled', true);

  	 		

			console.log(experiment.searchtype);

			var stimslist = ["target", "distractor1", "distractor2"];
			stimslist = shuffle(stimslist);

			if (experiment.searchtype == "monochrome") {
				experiment.distractorshape1 = experiment.shapes.pop();
				experiment.distractorshape2 = experiment.shapes.pop();
				experiment.distractorcolor1 = "None";
				experiment.distractorcolor2 = "None";
				for (i = 0; i < stimslist.length; i++) {
					if (stimslist[i] == "target") {
						var targetnum = i+1;
						var targetobject = "#sobject" + targetnum;
						experiment.targetpos = i+1;
						$(targetobject).attr("src", "stim-images/object" + experiment.targetshape + experiment.targetcolor + ".jpg");
					} else if (stimslist[i] == "distractor1") {
						var object = "#sobject" + (i+1);
						$(object).attr("src", "stim-images/object" + experiment.distractorshape1 + experiment.targetcolor + ".jpg");
					} else if (stimslist[i] == "distractor2") {
						var object = "#sobject" + (i+1);
						$(object).attr("src", "stim-images/object" + experiment.distractorshape2 + experiment.targetcolor + ".jpg");
					}
				}
  			} else if (experiment.searchtype == "polychrome") {
  				experiment.distractorshape1 = experiment.shapes.pop();
				experiment.distractorshape2 = experiment.shapes.pop();
				experiment.distractorcolor1 = experiment.colors.pop();
				experiment.distractorcolor2 = experiment.colors.pop();
				for (i = 0; i < stimslist.length; i++) {
					if (stimslist[i] == "target") {
						var targetnum = i+1;
						var targetobject = "#sobject" + targetnum;
						experiment.targetpos = i+1;
						$(targetobject).attr("src", "stim-images/object" + experiment.targetshape + experiment.targetcolor + ".jpg");
					} else if (stimslist[i] == "distractor1") {
						var object = "#sobject" + (i+1);
						$(object).attr("src", "stim-images/object" + experiment.distractorshape1 + experiment.distractorcolor1 + ".jpg");
					} else if (stimslist[i] == "distractor2") {
						var object = "#sobject" + (i+1);
						$(object).attr("src", "stim-images/object" + experiment.distractorshape2 + experiment.distractorcolor2 + ".jpg");
					}
				}
  			} else if (experiment.searchtype == "sedivy") {
  				experiment.distractorshape1 = experiment.shapes.pop();
  				experiment.distractorshape2 = "None";
				experiment.distractorcolor1 = experiment.colors.pop();
				experiment.distractorcolor2 = "None"; //same as target color
				for (i = 0; i < stimslist.length; i++) {
					if (stimslist[i] == "target") {
						var targetnum = i+1;
						var targetobject = "#sobject" + targetnum;
						experiment.targetpos = i+1;
						$(targetobject).attr("src", "stim-images/object" + experiment.targetshape + experiment.targetcolor + ".jpg");
					} else if (stimslist[i] == "distractor1") {
						var object = "#sobject" + (i+1);
						$(object).attr("src", "stim-images/object" + experiment.distractorshape1 + experiment.distractorcolor1 + ".jpg");
					} else if (stimslist[i] == "distractor2") {
						var object = "#sobject" + (i+1);
						$(object).attr("src", "stim-images/object" + experiment.distractorshape1 + experiment.targetcolor + ".jpg");
					}
				}
  			}
	

  			if (experiment.counter == 1) {
				$( "#sobject1" ).click(function() {
					experiment.numclicks++;
				});
				$( "#sobject2" ).click(function() {
					experiment.numclicks++;
				});
				$( "#sobject3" ).click(function() {
					experiment.numclicks++;
				});
				$(targetobject).click(function() {
					$(targetobject).css({"border-color": "#000000", 
         			"border-width":"2px", 
         			"border-style":"solid"});

					clickDisabled = false;
	  				$( "#totestbutton" ).attr('disabled', false);
				});
			}

	

			if (experiment.colorasked == true) {
				$("#sinstructions").html("Find the " + experiment.targetcolor + " " +  experiment.targetword[0] + ".");
			} else {
				$("#sinstructions").html("Find the " + experiment.targetword[0] + ".");
			}
			
			console.log(experiment.colorasked);


			$("#sobject1").show();
			$("#sobject2").show();
			$("#sobject3").show();
			
			$("#sinstructions").show();

		    $("#searchstage").fadeIn();
		    experiment.starttime = Date.now();


		} else if (phase == "test") {

			$("#sselector").hide();
			$("#sobject1").hide();
			$("#sobject2").hide();
			$("#sobject3").hide();
			
			$("#sinstructions").hide();


			$("#trainingstage").hide();
			$("#target").hide();

			$("#distractor1").hide();
			$("#distractor2").hide();


	    	$("#tinstructions").html("What percentage of " + experiment.targetword[1] + " do you think are " + experiment.targetcolor + "? <br> Use the slider below to indicate a response.");
	    	$("#tinstructions").show();
	    	
	    	$("#slider").show();
	    	$("#custom-handle").hide();

	    	experiment.percentage = document.getElementById("slider").value = 0;

		    $("#testingstage").fadeIn();
		    experiment.starttime = Date.now();
		}
		
	},

	start: function() {

		// put column headers in data file
		experiment.data.push("subid, counter, trialtype, percentage, observationtype, colorasked, searchtype, targetshape, targetcolor, distractorshape1, distractorshape2, distractorcolor1, distractorcolor2, numclicks, date, timestamp, rttrain, rtsearch, rttest, attnselected, targetpos");

		// randomize order of trial types
		experiment.trialtypes = shuffle(trialtypes);
		experiment.shapes = shuffle(shapes);
		experiment.colors = shuffle(colors);
		experiment.words = shuffle(words);

		// when we move forward in the trial, get the rt, add a line of data, add to the counter
		$( "#nexttrialbutton" ).click(function() {
			experiment.percentage = $("#slider").slider("option", "value");
			experiment.rttest = Date.now() - experiment.starttime;
			experiment.processOneRow();
			experiment.counter++;
			$("#testingstage").fadeOut(500);
				setTimeout(function() {
					experiment.next("train");
				}, 550);
			
		});

		$( "#totestbutton" ).click(function() {
			experiment.rtsearch = Date.now() - experiment.starttime;
			$("#trainingstage").fadeOut(500);
				setTimeout(function() {
					experiment.next("test");
				}, 550);
			
		});


		$( "#tosearchbutton" ).click(function() {
			experiment.rttrain = Date.now() - experiment.starttime;
			$("#trainingstage").fadeOut(500);
				setTimeout(function() {
					experiment.next("search");
				}, 550);
			
		});

		$("#slider").slider({
	        change: function(event, ui) {
	            $("#custom-handle").show();
	        }
   		});


		experiment.next("train");
	},

    
}
		