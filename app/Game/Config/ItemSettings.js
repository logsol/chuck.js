define([
],
 
function () {
    
    "use strict";

    var ItemSettings = {

        // weight is a number between 0.1 for very light and 10 for very heavy

        "Default": 
        {
            "category":     "",
            "image":        "",
            
            "type":         "rectangle",
            "weight":       "2.5",
            "width":        "25",
            "height":       "25",

            "rotation":     "0",
            "bounce":       "0",
            "grabAngle":    "-1.5",
            "danger":       "0",
            "bodyType":     "dynamic",
        },

        "RagDoll": 
        {
            "category":     "graveyard",
            "image":        "chest.png",
            
            "type":         "ragdoll",
            "weight":       "7",
            "width":        "6",
            "height":       "12",

            "bounce":       "4",
            "grabAngle":    "-0.5",
            "danger":       "1",
        },

        "Knife": 
        {
            "category":     "kitchen",
            "image":        "knife.gif",
            
            "weight":       "1.5",
            "width":        "4",
            "height":       "15",

            "grabAngle":    "0.3",
            "danger":       "3",
        },

        "Large Knife": 
        {
            "category":     "kitchen",
            "image":        "knife_big.gif",
            
            "weight":       "2.2",
            "width":        "4",
            "height":       "23",

            "grabAngle":    "0.3",
            "danger":       "3",
        },

        "Small Cleaver": 
        {
            "category":     "kitchen",
            "image":        "cleaver_small.gif",
            
            "weight":       "2",
            "width":        "6",
            "height":       "17",

            "grabAngle":    "0.3",
            "danger":       "3",
        },

        "Large Cleaver": 
        {
            "category":     "kitchen",
            "image":        "cleaver_large.gif",
            
            "weight":       "3",
            "width":        "8",
            "height":       "22",

            "grabAngle":    "0.3",
            "danger":       "3",
        },

        "Herb Chopper": 
        {
            "category":     "kitchen",
            "image":        "herb_chopper.gif",
            
            "weight":       "1.1",
            "width":        "9",
            "height":       "7",

            "grabAngle":    "0.3",
            "danger":       "2.6",
        },

        "Fork": {
            "category":     "kitchen",
            "image":        "fork.gif",
            
            "weight":       "1.5",
            "width":        "5",
            "height":       "16",

            "grabAngle":    "0.3",
            "danger":       "1.8",
        },

        "Meat Fork": {
            "category":     "kitchen",
            "image":        "fork_meat.gif",
            
            "weight":       "2",
            "width":        "3",
            "height":       "22",

            "grabAngle":    "0.3",
            "danger":       "1.9",
        },

        "Spoon": {
            "category":     "kitchen",
            "image":        "spoon.gif",
            
            "weight":       "2",
            "width":        "4",
            "height":       "21",

            "grabAngle":    "0.3",
            "danger":       "1.1",
        },

        "Plate": {
            "category":     "kitchen",
            "image":        "plate.gif",
            
            "type":         "circle",
            "weight":       "1.9",
            "width":        "13",
            "height":       "13",

            "grabAngle":    "0",
        },

        "Cup": {
            "category":     "kitchen",
            "image":        "cup.gif",
            
            "weight":       "1.1",
            "width":        "8",
            "height":       "8",

            "grabAngle":    "-0.3",
        },

        "Can": 
        {
            "category":     "kitchen",
            "image":        "can.gif",
            
            "weight":       "1",
            "width":        "4",
            "height":       "7",

            "grabAngle":    "-0.1",
            "bounce":       "2",
        },

        "Rolling Pin": 
        {
            "category":     "kitchen",
            "image":        "rolling_pin.gif",
            
            "weight":       "1.3",
            "width":        "6",
            "height":       "26",

            "grabAngle":    "0.3",
        },

        "Pan": 
        {
            "category":     "kitchen",
            "image":        "pan.gif",
            
            "weight":       "1.4",
            "width":        "14",
            "height":       "8",

            "grabAngle":    "0.3",
        },

        "Refridgerator": 
        {
            "category":     "kitchen",
            "image":        "fridge.gif",
            
            "weight":       "5",
            "width":        "31",
            "height":       "53",

            "bounce":       "0",
            "grabAngle":    "-0.5",
        },

        "Microwave": 
        {
            "category":     "kitchen",
            "image":        "microwave.gif",
            
            "weight":       "4.6",
            "width":        "19",
            "height":       "12",

            "grabAngle":    "-0.1",
            "danger":       "2", 
        },

        "Coffeemachine": 
        {
            "category":     "kitchen",
            "image":        "coffeemachine.gif",
            
            "weight":       "2.4",
            "width":        "11",
            "height":       "14",
        },

        "Toaster": 
        {
            "category":     "kitchen",
            "image":        "toaster.gif",
            
            "weight":       "1.9",
            "width":        "15",
            "height":       "9",
        },

        "Table": 
        {
            "category":     "kitchen",
            "image":        "table.gif",
            
            "weight":       "3.5",
            "width":        "60",
            "height":       "21",

            "grabAngle":    "-0.2",
        },

        "Banana": 
        {
            "category":     "kitchen",
            "image":        "banana.gif",
            
            "weight":       "3",
            "width":        "5",
            "height":       "9",

            "grabAngle":    "0.5",
        },

        "Tomato": 
        {
            "category":     "kitchen",
            "image":        "tomato.gif",
            
            "type":         "circle",
            "weight":       "1",
            "width":        "8",
            "height":       "9",

            "grabAngle":    "-0.3",
        },

        "Football": 
        {
            "category":     "outdoor",
            "image":        "football.gif",
            
            "type":         "circle",
            "weight":       "2",
            "width":        "10",
            "height":       "10",

            "bounce":       "6",
        },

        "Skateboard": 
        {
            "category":     "outdoor",
            "image":        "skateboard.gif",
            
            "type":         "skateboard",
            "weight":       "1.5",
            "width":        "26",
            "height":       "6",

            "grabAngle":    "-1.5",
        },

        "Laundry Machine": 
        {
            "category":     "laundry",
            "image":        "laundry_machine.gif",
            
            "weight":       "10",
            "width":        "24",
            "height":       "31",

            "grabAngle":    "-0.5",
        },

        "Laundry Powder": 
        {
            "category":     "laundry",
            "image":        "laundry_powder.gif",
            
            "weight":       "2",
            "width":        "11",
            "height":       "13",

            "grabAngle":    "-0.2",
        },

        "Couch": 
        {
            "category":     "livingroom",
            "image":        "couch.gif",
            
            "weight":       "7",
            "width":        "50",
            "height":       "29",
            "bounce":       "3",

            "grabAngle":    "-0.2", 
        },

        "Cactus": 
        {
            "category":     "livingroom",
            "image":        "cactus.gif",
            
            "weight":       "2.5",
            "width":        "17",
            "height":       "31",

            "danger":       "1.9",

            "grabAngle":    "-0.2", 
        },

        "Piano": 
        {
            "category":     "livingroom",
            "image":        "piano.gif",
            
            "weight":       "10",
            "width":        "66",
            "height":       "48",

            "grabAngle":    "-0.2", 
        },

        "Bible": 
        {
            "category":     "livingroom",
            "image":        "book_bible.gif",
            
            "weight":       "1.5",
            "width":        "11",
            "height":       "14",

            "grabAngle":    "-0.2", 
        },

        "Television": 
        {
            "category":     "livingroom",
            "image":        "television.gif",
            
            "weight":       "7",
            "width":        "24",
            "height":       "21",

            "grabAngle":    "-0.4", 
        },

        "TV Cabinet": 
        {
            "category":     "livingroom",
            "image":        "telly_cabinet.gif",
            
            "weight":       "5",
            "width":        "24",
            "height":       "17",

            "grabAngle":    "-0.4", 
        },


        "RubeDoll": 
        {
            "category":     "kitchen",
            "image":        "banana.gif",

            "weight":       "3",
            "width":        "15",
            "height":       "9",

            "type":         "rubedoll",
            "grabAngle":    "0.001",  // seems to be a bug, that 0 does not work!
        }
    };

    return ItemSettings;
});