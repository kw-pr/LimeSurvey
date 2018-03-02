/*
 * LimeSurvey (tm)
 * Copyright (C) 2012-2016 The LimeSurvey Project Team / Carsten Schmitz
 * All rights reserved.
 * License: GNU/GPL License v3 or later, see LICENSE.php
 * LimeSurvey is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 */
var LS = LS || {
    onDocumentReady: {}
};
var QuestionFunctions = function () {

    var
        /**
         * Validate question object before submit : actually only title need to be validated
         * This disallow submitting if Question code are not unique (else loose all fields)
         */
        validateQuestion = function (jqObject) {
            if (typeof jqObject == "undefined") {
                jqObject = $([]);
            }
            $.post(
                validateUrl, 
                {
                    title: $('#frmeditquestion [name="title"]:first').val(),
                    other: $('#frmeditquestion [name="other"]:checked:first').val(),
                },
                function (data) {
                    // Remove all custom validity
                    if (hasFormValidation) {
                        $('#frmeditquestion input.has-error').each(function () {
                            if (hasFormValidation) {
                                $(this)[0].setCustomValidity('');
                            }
                            $(this).removeClass("has-error");
                            $(this).next('.errorMessage').remove();
                        });
                    }
                    // No error : submit
                    if ($.isEmptyObject(data)) {
                        if ($(jqObject).is(":submit")) {
                            $(jqObject).trigger('click', {
                                validated: true
                            });
                        }
                    } else {
                        // Add error information for each input
                        $.each(data, function (name, aError) {
                            if ($(jqObject).is(":submit")) {
                                $("#frmeditquestion").closest("#tabs").find(".ui-tabs-anchor:first").click();
                                $('#frmeditquestion [type!=hidden][name="' + name + '"]').focus(); // Focus on the first input
                            }
                            $('#frmeditquestion [type!=hidden][name="' + name + '"]').addClass("has-error");
                            if (!$('#frmeditquestion [type!=hidden][name="' + name + '"]:last').next('.errorMessage').length) // :last for radio list
                            {
                                $("<span class='errorMessage text-warning' />").insertAfter('#frmeditquestion [type!=hidden][name="' + name + '"]:last');
                            }
                            $.each(aError, function (i, error) {
                                if (hasFormValidation) {
                                    $('#frmeditquestion [type!=hidden][name="' + name + '"]').each(function () {
                                        $(this)[0].setCustomValidity(error);
                                    });
                                }
                                $('#frmeditquestion [type!=hidden][name="' + name + '"]').next('.errorMessage').text(error);
                            });
                        });
                    }
                },
                dataType = "json"
            );
        },


        onSelectQuestionType = function () {
            var questionVars = $(this).data('question-type');
            $('#selector__currentQuestionTypeTitle').html(questionVars.title)
            $('#selector__currentQuestionTypeImage').html(getQuestionTypeImage(questionVars.key));
            $('#selector__selected_questiontype').val(questionVars.key);
            $('.selector__select-question-type').removeClass('mark-as-selected');
            $(this).addClass('mark-as-selected');
        },
        getQuestionTypeImage = function (questioncode) {

            var multiple = 1;
            if (questioncode == 'S') multiple = 2;

            if (questioncode == ":") questioncode = "COLON";
            else if (questioncode == "|") questioncode = "PIPE";
            else if (questioncode == "*") questioncode = "EQUATION";

            var imageArray = [];
            for (i = 1; i <= multiple; i++) {
                imageArray.push(imgurl + "/screenshots/" + questioncode + (i == 1 ? '' : i) + ".png");
            }

            return imageArray.reduce(function (prev, curr, idx) {
                return prev + '<img src="' + curr + '" />';
            }, '');
        },

        init = function () {

            updatequestionattributes();
            $('#question_type').on('change', updatequestionattributes);
            if(selectormodeclass == 'default' || selectormodeclass == 'full'){
                //bind advanced selector
                $('#selector__modal_select-question-type').on('hide.bs.modal', updatequestionattributes);
                $('#selector__modal_select-question-type').on('show.bs.modal', function () {
                    var question_class = questionTypeArray[$('#question_type').val()].class;
                    $('#selector__question-type-select-modal_question-type-' + question_class).addClass('mark-as-selected').trigger('click').closest('div.panel-collapse').addClass('in');
                });

                $('#selector__select-this-questiontype').on('click', function () {
                    $('#question_type').val($('#selector__selected_questiontype').val());
                    $('#selector__editView_question_type_description').html($('#selector__currentQuestionTypeTitle').html());
                    $('#selector__modal_select-question-type').modal('hide');
                })
                $('.selector__select-question-type').on('click', onSelectQuestionType);
            }

            /**
             * Validate question object on blur on title element
             */
            $('#frmeditquestion :not(:hidden)[name="title"]').on('blur', function () {
                validateQuestion($(this));
            });

            /**
             * Validate question object before click on a submit button
             */
            $('#frmeditquestion :submit').on('click', function (event, data) {
                data = data || event.data || false;
                if (data && data.validated) {
                    return true;
                } else {
                    validateQuestion($(this));
                    return false;
                }
            });

            $("#question_type").on('change', function (event) {
                OtherSelection(this.value);
            });

        };
    return {
        init: init
    };
}


$(document).on('ready  pjax:scriptcomplete', function () {
    window.questionFunctions = window.questionFunctions || (new QuestionFunctions());
    window.questionFunctions.init();
});


function updatequestionattributes() {
    var type = $('#question_type').val();
    OtherSelection(type);

    $('.loader-advancedquestionsettings').removeClass("hidden");
    $('.panel-advancedquestionsettings').remove();

    var selected_value = $("#question_type").val();

    var postData = {
        'qid': $('#qid').val(),
        'question_type': selected_value,
        'sid': $('input[name=sid]').val()
    };

    $.ajax({
        url: attr_url,
        data: postData,
        method: 'POST',
        success: function (data) {
            $('.loader-advancedquestionsettings').before(data);
            $('.loader-advancedquestionsettings').addClass("hidden");
            $('label[title]').qtip({
                style: {
                    name: 'cream',
                    tip: true,
                    color: '#111111',
                    border: {
                        width: 1,
                        radius: 5,
                        color: '#EADF95'
                    }
                },
                position: {
                    adjust: {
                        screen: true,
                        scroll: true
                    },
                    corner: {
                        target: 'bottomRight'
                    }
                },
                show: {
                    effect: {
                        length: 50
                    }
                }
            });
            renderBootstrapSwitch();
        }
    });
}

var qtypes = new Array();
var qnames = new Array();
var qhelp = new Array();
var qcaption = new Array();


function OtherSelection(QuestionType) {
    if (QuestionType == undefined) {
        //console.log('Error: OtherSelection: QuestionType must not be undefined');
        return;
    }
    try{
        if (QuestionType == '') {
            QuestionType = document.getElementById('question_type').value;
        }
        if (QuestionType == 'M' || QuestionType == 'P' || QuestionType == 'L' || QuestionType == '!') {
            document.getElementById('OtherSelection').style.display = '';
            document.getElementById('Validation').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = '';
        } else if (QuestionType == 'W' || QuestionType == 'Z') {
            document.getElementById('OtherSelection').style.display = '';
            document.getElementById('Validation').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = '';
        } else if (QuestionType == '|') {
            document.getElementById('OtherSelection').style.display = 'none';
            document.getElementById('Validation').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = 'none';
        } else if (QuestionType == 'F' || QuestionType == 'H') {
            document.getElementById('OtherSelection').style.display = 'none';
            document.getElementById('Validation').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = '';
        } else if (QuestionType == ':' || QuestionType == ';') {
            document.getElementById('OtherSelection').style.display = 'none';
            document.getElementById('Validation').style.display = '';
            document.getElementById('MandatorySelection').style.display = '';
        } else if (QuestionType == '1') {
            document.getElementById('OtherSelection').style.display = 'none';
            document.getElementById('Validation').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = '';
        } else if (QuestionType == 'S' || QuestionType == 'T' || QuestionType == 'U' || QuestionType == 'N' || QuestionType == '' || QuestionType == 'K') {
            document.getElementById('Validation').style.display = '';
            document.getElementById('OtherSelection').style.display = 'none';
            if (document.getElementById('ON')) {
                document.getElementById('ON').checked = true;
            }
            document.getElementById('MandatorySelection').style.display = '';
        } else if (QuestionType == 'X') {
            document.getElementById('Validation').style.display = 'none';
            document.getElementById('OtherSelection').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = 'none';
        } else if (QuestionType == 'Q') {
            document.getElementById('Validation').style.display = '';
            document.getElementById('OtherSelection').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = '';
        } else {
            document.getElementById('OtherSelection').style.display = 'none';
            if (document.getElementById('ON')) {
                document.getElementById('ON').checked = true;
            }
            document.getElementById('Validation').style.display = 'none';
            document.getElementById('MandatorySelection').style.display = '';
        }
    } catch(e) {
        if(window.debugState.backend) console.ls.error(e);
    }
}
