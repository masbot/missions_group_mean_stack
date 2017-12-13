var FormValidation = (function(){

    var $idInput = $(".id-input");
    var $emailFirstInput = $(".email-first-input");
    var $emailLastInput = $(".email-last-input");
    var $passwordInput = $(".password-input");
    var $passwordVerifyInput = $(".password-verify-input");
    var $nameInput = $(".name-input");
    var $areaCodeInput = $(".area-code-input");
    var $phoneFirstInput = $(".phone-first-input");
    var $phoneLastInput = $(".phone-last-input");
    var $genderMaleInput = $(".gender-male-input");
    var $genderFemaleInput = $(".gender-female-input");
    var $agreeOneInput = $(".agree-one-input");
    var $agreeTwoInput = $(".agree-two-input");
    var $radioInput = $('input[type="radio"]');
    var $submit = $(".submit");

    var $idError = $(".id-error");
    var $emailError = $(".email-error");
    var $passwordError = $(".password-error");
    var $passwordVerifyError = $(".password-verify-error");
    var $nameError = $(".name-error");
    var $phoneError = $(".phone-error");
    var $genderError = $(".gender-error");
    var $agreementError = $(".agreement-error");

    var _id = 1;
    var _email = 2;
    var _password = 3;
    var _name = 4;
    var _phone = 5;
    var _gender = 6;
    var _agreement = 7;

    var errorLog = [];

    var validator = function(predicate) {
        return function(elem, errorCode, message, error) {
            if(predicate(elem.val(), errorCode)) {
                elem.removeClass('error');
                error.hide();
            }else{
                elem.addClass('error');
                error.text('').text(message).show();
            }
        };
    };

    var validator2 = function (predicate){
        return function(elem, elem2, errorCode, message, error){
            if(predicate(elem.val(), elem2.val(), errorCode)) {
                elem.removeClass('error');
                elem2.removeClass('error');
                error.hide();
            }else{
                elem.addClass('error');
                elem2.addClass('error');
                error.text('').text(message).show();
            }
        }
    };

    var validator3 = function( predicate ){
        return function( elem, elem2, errorCode, message , error ){
            if(predicate(elem.val(), elem2.val(), errorCode)){
                elem.removeClass('error');
                elem2.removeClass('error');
                error.hide();
            }else{
                elem.addClass('error');
                elem2.addClass('error');
                error.text('').text(message).show();
            }
        }
    };

    var validator4 = function( predicate ){
        return function( elem, elem2, elem3, errorCode, message , error ){
            if(!predicate(elem.val(), elem2.val(), elem3.val(), errorCode)){
                elem.addClass('error');
                elem2.addClass('error');
                elem3.addClass('error');
                error.text('').text(message).show();
            }else{
                elem.removeClass('error');
                elem2.removeClass('error');
                elem3.removeClass('error');
                error.hide();
            }
        }
    };

    var validator5 = function( predicate ){
        return function(elem, elem2, errorCode, message, error){
            if(predicate(elem, elem2, errorCode)) {
                elem.removeClass('error');
                error.hide();
            }else{
                elem.addClass('error');
                error.text('').text(message).show();
            }
        }
    };

    var validator6 = function( predicate ){
        return function(elem, elem2, errorCode, message, error){
            if(predicate(elem, elem2, errorCode)) {
                elem.removeClass('error');
                error.hide();
            }else{
                elem.addClass('error');
                error.text('').text(message).show();
            }
        }
    };

    var emptyValidator = validator(function(userInput, errorCode) {
        var bool = userInput.length > 0;
        error(bool, errorCode);
        return  userInput.length > 0;
    });

    var passwordVerify = validator2(function(userInput, userInput2, errorCode){
        var result = userInput === userInput2;
        error(result, errorCode);
        return result;
    });

    var emailValidator = validator3(function(userInput, userInput2, errorCode){
        var email = userInput+'@'+userInput2;
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var result = re.test(email);
        error(result, errorCode);
        return result;
    });

    var phoneNumberValidator = validator4(function(userInput, userInput2, userInput3, errorCode){
        var phoneNumber = userInput+userInput2+userInput3;
        var result = !isNaN(phoneNumber);
        error(result, errorCode);
        return result;
    });

    var checkedORValidator = validator5(function(elem , elem2, errorCode){
        var result = elem.is(':checked') || elem2.is(':checked');
        error(result, errorCode);
        return result;
    });

    var checkedANDValidator = validator6(function(elem , elem2, errorCode){
        var result =  elem.is(':checked') && elem2.is(':checked');
        error(result, errorCode);
        return result;
    });

    /*
     * Manages errors logs of types of error code
     * */
    function error( bool, errorCode ){
        var result = contains(errorLog, errorCode);
        if(bool){
            if(result){
                var position = $.inArray(errorCode, errorLog);
                errorLog.splice(position, 1);
            }
        }else{
            if(!result){
                errorLog.push(errorCode);
            }
        }
    }

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    $submit.click(function(){
        emptyValidator($idInput, _id, "Id value is empty", $idError);
        emptyValidator($emailFirstInput, _email, "Email value is empty", $emailError);
        emptyValidator($emailLastInput, _email, "Email value is empty", $emailError);
        emptyValidator($nameInput,  _name, "Name value is empty", $nameError);
        emptyValidator($areaCodeInput, _phone, "Phone value is empty", $phoneError);
        emptyValidator($phoneFirstInput, _phone, "Phone value is empty", $phoneError);
        emptyValidator($phoneLastInput, _phone, "Phone value is empty", $phoneError);
        emptyValidator($passwordInput, _password, "Password value is empty", $passwordError);
        emptyValidator($passwordVerifyInput, _password, "Password Verify value is empty", $passwordVerifyError);
        checkedORValidator($genderMaleInput, $genderFemaleInput, _gender, "Gender value is empty", $genderError);
        checkedANDValidator($agreeOneInput, $agreeTwoInput, _agreement, "Must be checked", $agreementError);

        if($passwordInput.val().length > 0 && $passwordVerifyInput.val().length > 0){
            passwordVerify($passwordInput, $passwordVerifyInput, _password, "Passwords do not match", $passwordVerifyError);
        }

        if($emailFirstInput.val().length > 0 && $emailLastInput.val().length > 0){
            emailValidator($emailFirstInput, $emailLastInput, _email, "Incorrect value for Email.", $emailError);
        }

        if($areaCodeInput.val().length > 0 && $phoneFirstInput.val().length > 0 && $phoneLastInput.val().length > 0){
            phoneNumberValidator($areaCodeInput, $phoneFirstInput, $phoneLastInput, _phone, "Values must be numbers.", $phoneError);
        }

        if(errorLog.length == 0){
            alert("가입완료 되었습니다");
        }
    });

    $radioInput.on('change', function() {
        $radioInput.not(this).prop('checked', false);
    });
}());