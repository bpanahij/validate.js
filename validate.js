/*
    This file is part of validate.js.

    Validate.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Validate.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Validate.js. If not, see <http://www.gnu.org/licenses/>.

    Author: Brian P Johnson
    Contact: brian@pjohnson.info
*/

var savedAction = "";
var validated = new Array();

$(document).ready(function() {
    var field = $('.validate');
    $(field).validate();
    $(field).each(function(index, value) {
        validateIt(value);
    });
});

(function($) {
    $.fn.validate = function() {
        $(this).bind('focus keyup change select submit', function(e) {
            validateIt(e.target);
        });
    };
})(jQuery);


function validateIt(element) {
    var regex = $(element).attr('validate');
    $(element).parent().find('b.validated').remove();

    var tagType = $(element)[0].tagName;

    var value = "";
    if(tagType == "INPUT") value = $(element).val();
    if(tagType == "SELECT") value = $(element).val();
    if(tagType == "TEXTAREA") value = $(element).val();

    if($(element).attr('req')) {
        if(!$(element).val() || !$(element).val().length) {
            $('<b class="validated"> &#x2717;</b>').css({'color':'#CC0000','font-size':'18px'}).insertAfter(element);
            disableForm(element);
        }
    }
    if(regex) {
        if(!$(element).val() || !$(element).val().length) {
        }
        else {
            regex = new RegExp(regex,"");
            if( !$(element).val().match(regex) ) {
                $('<b class="validated"> &#x2717;</b>').css({'color':'#CC0000','font-size':'18px'}).insertAfter(element);
                disableForm(element);
            } else {
                $('<b class="validated"> &#x2713;</b>').css({'color':'#006600','font-size':'18px'}).insertAfter(element);
                enableForm(element);
            }
        }
    }
}

function enableForm(e) {
    if(validated[e.id]) {
        delete validated[e.id];
        validated.length--;
    }
    if(!validated.length && savedAction.length) {
        action = savedAction;
        $(e).closest('form').attr('action', action);
        $(e).closest('form').unbind('submit');
    }
}

function disableForm(e) {
    if(!validated[e.id]) {
        validated[e.id] = e;
        validated.length++;
    }
    var action = $(e).closest('form').attr('action');
    if(action != "#") {
        savedAction = action;
        $(e).closest('form').attr('action','#');
        $(e).closest('form').bind('submit', function() {
            return invalid();
        });
    }
}

function invalid() {
    $('#alert').append('<div id="alert" style="display:none">You have missing or invalid field values.</div>');
    $('#alert').dialog({
        modal: true,
        buttons: {
            "OK" : function() {
                $(this).dialog("destroy");
            }
        }   
    });
    return false;
}
