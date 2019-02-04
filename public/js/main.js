
var REGION_OBJ;
var INTEREST_OBJ;

$(document).ready(function(){
    var target_url = 'https://fb-target-anonyxhappie.herokuapp.com/api/v1';
    var graph_url = 'https://graph.facebook.com/v2.11/search';
    var access_token = 'EAACcz9Hkm2EBAJs0R8p8MUNddpU2HoFLq2U2CrBoZApj5DUGG3TzZBbTXMRYFi8P2xLhVrvzeVi1nR4DqN94Nz1dZBHACVRHZAgSro99O5g6qSPTB9htHvUFZCpnDd1aiGer8wZCIEU0kNtrL4AY28H1yd1m9sx0eI1GeZAQtRFVAZDZD';
    var u_token = 'cf092d4924ae253cf8a57f1cf02218f1dfe98c53';

    getRegions(target_url, u_token);
    getInterests(target_url, u_token);

    $("#searchCity").on("change paste keyup", function() { 
        getRegionsForDatalist(this, graph_url, access_token);
    });
    
    $("#searchInterest").on("change paste keyup", function() { 
        getInterestsForDatalist(this, graph_url, access_token);
    });
    
    $("#searchCity").on("input", function(){
        addRegion(this, target_url, u_token);
        $(this).val('');
    });

    $("#searchInterest").on("input", function(){
        addInterest(this, target_url, u_token);
        $(this).val('');
    });

});

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getRegionsForDatalist(obj, graph_url, access_token){
    $.get(
        graph_url 
        + '?location_types=["city","country"]&type=adgeolocation&q=' + $(obj).val() 
        + '&access_token=' + access_token, 
        function(data, status){
            if (data.data.length > 0) REGION_OBJ = data.data;
            for (var i=0; i < data.data.length; i++){
                $("#cities").append(
                    '<option data-value="' + i
                    + '" value="' + data.data[i].name + ', ' + data.data[i].region + ', ' + data.data[i].country_name 
                    + '">');
            }
    });
}

function getInterestsForDatalist(obj, graph_url, access_token){
    $.get(
        graph_url 
        + '?type=adinterest&q=' + $(obj).val() 
        + '&access_token=' + access_token, 
        function(data, status){
            if (data.data.length > 0) INTEREST_OBJ = data.data;
            for (var i=0; i < data.data.length; i++){
                $("#interests").append(
                    '<option data-value="' + i
                    + '" value="' + data.data[i].id + ', ' + data.data[i].name + ', ' + data.data[i].path[0] + ', ' + data.data[i].audience_size 
                    + '">');
            }
    });
}

function getRegions(target_url, u_token){
    $.ajax({
        url: target_url + '/regions/',
        headers: {
            'Authorization':'Token ' + u_token,
            'Content-Type':'application/json'
        },
        method: 'GET',
        success: function(data){
            $("#cityList").empty();
            for (var i=0; i < data.length; i++){
                $("#cityList").append('<li class="list-group-item">' + data[i].city + ', ' + data[i].region + ', ' + data[i].country_name + '</li>');
            }
        }
      });
}

function getInterests(target_url, u_token){
    $.ajax({
        url: target_url + '/interests/',
        headers: {
            'Authorization':'Token ' + u_token,
            'Content-Type':'application/json'
        },
        method: 'GET',
        success: function(data){
            $("#interestList").empty();
            for (var i=0; i < data.length; i++){
                $("#interestList").append('<li class="list-group-item">' + data[i].interest_id + ', ' + data[i].name + ', ' + data[i].path + ', ' + data[i].audience_size + '</li>');
            }
        }
      });
}

function addRegion(obj, target_url, u_token){
    if ($(obj).val()){
        var d = document.querySelector('#cities option[value="'+ $(obj).val() +'"]').dataset.value;
         
        if(IsJsonString(JSON.stringify(REGION_OBJ[d]))){
            $.ajax({
                url: target_url + '/regions/',
                headers: {
                    'Authorization':'Token ' + u_token,
                    'Content-Type':'application/json'
                },
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(REGION_OBJ[d]),
                success: function(data){
                    console.log(JSON.stringify(data));
                    getRegions(target_url, u_token);
                }
            });
        } else {
            console.log(JSON.stringify(REGION_OBJ[d]));
            // alert('Something went wrong with selected region.');
        }
    }
}

function addInterest(obj, target_url, u_token){
    if ($(obj).val()){
        var d = document.querySelector('#interests option[value="'+ $(obj).val() +'"]').dataset.value;
        
        if(IsJsonString(JSON.stringify(INTEREST_OBJ[d]))){
            var parsed_data = INTEREST_OBJ[d];
            var new_d = {
                id: parsed_data.id,
                name: parsed_data.name,
                audience_size: parsed_data.audience_size,
                path: parsed_data.path[0],
                topic: parsed_data.topic
            }
            $.ajax({
                url: target_url + '/interests/',
                headers: {
                    'Authorization':'Token ' + u_token,
                    'Content-Type':'application/json'
                },
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(new_d),
                success: function(data){
                    console.log(JSON.stringify(data));
                    getInterests(target_url, u_token);
                }
            });
        } else {
            console.log(JSON.stringify(INTEREST_OBJ[d]));
            // alert('Something went wrong with selected interest.');
        }
    }
}