/**
 * Calculator
 * @author Hatem A. <hatem@tuta.io>
 * @version 1.0
 * @licence Licensed under the Apache License, Version 2.0
 */

var calculator = (function(){

  // current item on screen
  var currentScreenItem;

  // current formula on screen
  var currentScreenFormula;

  // locks & toggles
  var dotLock;
  var equalLock;
  var signLock;
  var minusLock;

  // modes
  var resultMode;

  // selectors
  var CURRENT_SCREEN_ITEM_SELECTOR = "#current-screen-item";
  var CURRENT_SCREEN_FORMULA_SELECTOR = "#current-screen-formula";
  var AC_SELECTOR = "#ac";
  var CE_SELECTOR = "#ce";
  var NUM_SELECTOR = ".num";
  var ADD_SELECTOR = "#add";
  var SUBSTRACT_SELECTOR = "#substract";
  var DIVIDE_SELECTOR = "#divide";
  var MULTIPLY_SELECTOR = "#multiply";
  var DOT_SELECTOR = "#dot";
  var EQUAL_SELECTOR = "#equal";

  var Stack = function() {
    var elements = [];
    var top = 0;

    var push = function(element){
      elements[top++] = element; 
    };

    var pop = function() {
      return elements[--top];
    };

    var peek = function() {
      return elements[top-1];
    };

    var length = function() {
      return top;
    };

    return {push:push,
            pop:pop,
            peek:peek,
            length:length
           };
  };

  /**
    * Initialze calculator for first time use.
    */
  var init = function(){
    reset();
    eventsRegister();
  }

  /**
    * Reset calculator.
    */
  var reset = function(){
    resetScreen();
    resetLocks();
    resetModes();
  }

  /**
    * Reset screen.
    */  
  var resetScreen = function(){
    setCurrentScreenItem(0);
    setCurrentScreenFormula("");    
  }

  /**
    * Reset locks.
    */  
  var resetLocks = function(){
    setEqualLock(true);
    setSignLock(true);
    setDotLock(false);    
    setMinusLock(false);
  }

  /**
    * Reset modes.
    */  
  var resetModes = function(){
    setResultMode(false);
  }

  /**
    * Get current screen item.
    * @returns {String} currentScreenItem.    
    */
  var getCurrentScreenItem = function(){
    return currentScreenItem;
  }

  /**
    * Set current screen item.
    * @param {String} item - current number or sign.
    */ 
  var setCurrentScreenItem = function(item){
    currentScreenItem = item;
    $(CURRENT_SCREEN_ITEM_SELECTOR).html(item);
  }

  /**
    * Append to current screent item.
    * @param {String} text.
    */ 
  var appendCurrentScreenItem = function(text){
    var newItem = getCurrentScreenItem() + text;
    setCurrentScreenItem(newItem);
  }

  /**
    * Remove last screen item.
    */  
  var removeLastCurrentScreenItem = function(){
    setCurrentScreenItem(0);
    var formula = getCurrentScreenFormula();
    var newFormula = formula.substr(0,formula.length - 1);
    setCurrentScreenFormula(newFormula);
  }

  /**
    * Get current screen formula.
    * @return {String} currentScreenFormula.
    */ 
  var getCurrentScreenFormula = function(){
    return currentScreenFormula;
  }

  /**
    * Set current screen formula.
    * @param {String} formula.
    */ 
  var setCurrentScreenFormula = function(formula){
    currentScreenFormula = formula;
    $(CURRENT_SCREEN_FORMULA_SELECTOR).html(formula);
  }

  /**
    * Append to current screent formula.
    * @param {String} text.
    */
  var appendCurrentScreenFormula = function(text){
    var newFormula = getCurrentScreenFormula() + text;
    setCurrentScreenFormula(newFormula);
  }

  /**
    * Is equal sign locked ?.
    * @return {Boolean} equalLock.
    */ 
  var isEqualLocked = function(){
    return equalLock;
  }

  /**
    * Set equal lock status.
    * @param {Boolean} lock.
    */
  var setEqualLock = function(lock){
    equalLock = lock;
  }

  /**
    * Is dot locked ?.
    * @return {Boolean} dotLock.
    */
  var isDotLocked = function(){
    return dotLock;
  }

  /**
    * Set dot lock status.
    * @param {Boolean} lock.
    */
  var setDotLock = function(lock){
    dotLock = lock;
  }

  /**
    * Is sign locked ?.
    * @return {Boolean} signLock.
    */
  var isSignLocked = function(){
    return signLock;
  }

  /**
    * Set sign lock status.
    * @param {Boolean} lock.
    */
  var setSignLock = function(lock){
    signLock = lock;
  }

  /**
    * Is minus locked ?.
    * @return {Boolean} minusLock.
    */
  var isMinusLocked = function(){
    return minusLock;
  }

  /**
    * Set minus lock status.
    * @param {Boolean} lock.
    */
  var setMinusLock = function(lock){
    minusLock = lock;
  }

  /**
    * Is result mode on ?.
    * @return {Boolean} resultMode.
    */
  var isResultModeOn = function(){
    return resultMode;
  }

  /**
    * Set result mode.
    * @param {Boolean} mode.
    */
  var setResultMode = function(mode){
    resultMode = mode;
  }

  /**
    * Remove last screen item.
    */  
  var removeLastCurrentScreenItem = function(){
    setCurrentScreenItem(0);
    var formula = getCurrentScreenFormula();
    var newFormula = formula.substr(0,formula.length - 1);
    setCurrentScreenFormula(newFormula);
  }

  /**
    * Register events.
    */
  var eventsRegister = function(){
    $(CE_SELECTOR).click(function(){
      ce();
    });

    $(AC_SELECTOR).click(function(){
      ac();
    });

    $(NUM_SELECTOR).click(function(){
      var number = $(this).html();
      num(number);
    });

    $(ADD_SELECTOR).click(function(){
      sign("+");
    });

    $(SUBSTRACT_SELECTOR).click(function(){
      sign("-");
    }); 

    $(DIVIDE_SELECTOR).click(function(){
      sign("÷");
    }); 

    $(MULTIPLY_SELECTOR).click(function(){
      sign("×");
    }); 

    $(DOT_SELECTOR).click(function(){
      dot();
    }); 

    $(EQUAL_SELECTOR).click(function(){
      equal();
    }); 
  }

  /**
    * Is it sign ?.
    * @param {String} token.
    * @return {Boolean} status.
    */
  var isSign = function(token){
    var status;

    switch(token){
      case "+":
      case "-":
      case "×":
      case "÷":
        status = true;
        break;
      default:
        status = false;
    }

    return status;
  }

  /**
    * Is it number ?.
    * @param {String} str.
    * @return {Boolean} status.
    */ 
  var isNumber = function(str){
    if(typeof str == "number" || (str * 0) == 0){
      return true;
    }

    return false;
  }

  /**
    * Is it dot ?.
    * @param {String} str.
    * @return {Boolean} status.
    */  
  var isDot = function(str){
    return (str === ".");
  }

  /**
    * Resolve postfix notation.
    */
  var resolvePostfix = function(postfix){
    var stack = new Stack();
    var token;

    for(var i=0;i<postfix.length;i++){
      token = postfix[i];

      if(isNumber(postfix[i])){
        stack.push(token);
      }else{
        var elementOne = stack.pop();
        var elementTwo = stack.pop();

        if(token == "+"){
          stack.push(elementOne + elementTwo);
        }else if(token == "-"){
          stack.push(elementTwo - elementOne);
        }else if(token == "×"){
          stack.push(elementOne * elementTwo);
        }else if(token == "÷"){
          stack.push(elementTwo / elementOne);
        }
      }
    }

    return stack.pop();
  };

  /**
    * Convert infix to postfix notation.
    */
  var infixToPostfix = function(){
    var postfix = [];
    var stack = new Stack();
    var infix = getCurrentScreenFormula();
    var currentNumber = "";
    var token;
    var prevToken = "";
    var operands = "-+÷×^";
    var operandOne;
    var operandTwo;     
    var precedence = {"^":4, "×":3, "÷":3, "+":2, "-":2};
    var associativity = {"^":"right", "×":"left", "÷":"left", "+":"left", "-":"left"}; 

    for(var i=0;i < infix.length;i++){
      token = infix[i];
      if(i > 0) prevToken = infix[i-1];

      if(isNumber(token) || isDot(token) || (isSign(token) && (isSign(prevToken) || prevToken == "") && token == "-")){
        currentNumber += token;
        if(isSign(infix[i+1]) || i == infix.length-1){
          postfix.push(parseFloat(currentNumber));
          currentNumber = "";
        }          
      }else if(isSign(token)){

        operandOne = token;
        operandTwo = stack.peek();

        while (operands.indexOf(operandTwo) != -1 && ((associativity[operandOne] == "left" && (precedence[operandOne] <= precedence[operandTwo]) ) || (associativity[operandOne] == "right" && (precedence[operandOne] < precedence[operandOne])))){
          postfix.push(operandTwo);
          stack.pop();
          operandTwo = stack.peek();
        }

        stack.push(operandOne);
      }          
    }

    while (stack.length() > 0){
      postfix.push(stack.pop());
    }

    return postfix;
  }

  /**
    * AC button.
    */
  var ac = function(){
    reset();
  }

  /**
    * Any number button.
    */
  var num = function(number){
    if(!isResultModeOn()){
      setCurrentScreenItem(number);
      appendCurrentScreenFormula(number);
      setEqualLock(false);
      setSignLock(false);
    }
  }

  /**
    * Dot button.
    */
  var dot = function(){
    if(!isResultModeOn() && !isDotLocked()){
      var screenItem = getCurrentScreenItem();

      if(!isNumber(screenItem) || screenItem == ""){
        appendCurrentScreenFormula("0.");
      }else{
        appendCurrentScreenFormula(".");
      }

      setCurrentScreenItem(".");    
      setDotLock(true);      
    }
  }

  /**
    * Any sign button.
    */
  var sign = function(sig){
    if(!isResultModeOn() && (!isSignLocked() || !isMinusLocked())){

      setEqualLock(true);
      setSignLock(true);
      setDotLock(false);

      var screenItem = getCurrentScreenItem();
      var currentFormula = getCurrentScreenFormula();

      if(currentFormula != ""){

        if(isNumber(screenItem)){
          appendCurrentScreenFormula(sig);        
        }else if(isDot(screenItem)){
          appendCurrentScreenFormula("0" + sig);
          setDotLock(false);
        }else if(isSign(screenItem) && sig == "-"){
          appendCurrentScreenFormula(sig);
          setMinusLock(true);
        }

        setCurrentScreenItem(sig); 

      }else if(currentFormula == "" && sig == "-"){
        appendCurrentScreenFormula(sig);
        setMinusLock(true);  
        setCurrentScreenItem(sig); 
      }

    }   
  }  

  /**
    * CE button.
    */
  var ce = function(){
    if(!isResultModeOn()){
      if(getCurrentScreenFormula() !== "") removeLastCurrentScreenItem();
    }else{
      var formula = getCurrentScreenFormula().replace(/=.*$/,"");
      setCurrentScreenFormula(formula);

      var item = getCurrentScreenFormula();
      item = item[item.length-1];
      setCurrentScreenItem(item);
      setSignLock(false);
      setResultMode(false);
    }

  }

  /**
    * Equal button.
    */
  var equal = function(){

    if(!isEqualLocked()){

      var postfix = infixToPostfix();
      var result = resolvePostfix(postfix);
      var screenItem = getCurrentScreenItem();
      var screenFormula = getCurrentScreenFormula();

      if(isDot(screenItem)){
        screenFormula += "0";
        setCurrentScreenFormula(screenFormula);
      }

      var finalScreenFromula = screenFormula + "=" + result;
      setCurrentScreenFormula(finalScreenFromula);
      setCurrentScreenItem(result);
      setResultMode(true);
    }
  }

  var getLastCharacterPrefix = function(){
    return prefix[prefix.length - 1];
  }

  return {
    init: init
  }

}());
