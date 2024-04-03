class Calculator {
    constructor() {

        this._statusAudio = "false"
        this._ramDam = "false"

        this._song = new Audio('click.mp3');
        this._operation = []
        this._lastNumber = ''
        this._lastOperator = ''

        this._numbersEl = document.getElementById("numbers");
        this._buttonsEl = document.querySelectorAll("button");
        this._dataEl = document.getElementById("data")
        this._hourEl = document.getElementById("hour")

        this._btnAudioEl = document.getElementById("audio")
        this._rampaEl = document.getElementById("rampa")

        this.audioController();

        this.initialize()
        this.setDataHour();
        this.continuousDate();
        this.buttonEvents();
        this.keyboard();
        this.paste()
        
        
    }


    playAudio() {

        if (this._statusAudio == "true") {

            this._song.currentTime = 0
            this._song.play()
        }
    }

    audioController() {

        this.addEventListenerAll(this._btnAudioEl, "click drag", e => {

            if (this._statusAudio == "false") {

                this._btnAudioEl.style.backgroundColor = "green"
                this._statusAudio = "true"

            }

            else{

                this._btnAudioEl.style.backgroundColor = "red"
                this._statusAudio = "false"
            }

        })

    }

    paste() {

        document.addEventListener('paste', e=>{

            
            let text = e.clipboardData.getData('Text')

            this.addOperation(parseFloat(text))

        })
    }

    copy() {

        let input = document.createElement('input')
        input.value = this._numbersEl.textContent
        document.body.appendChild(input)
        input.select()
        document.execCommand("Copy")
        input.remove()
    
    }

    keyboard() {

        document.addEventListener('keyup', e => {

            this.playAudio()


            switch (e.key) {

                case 'Backspace':

                    if(this.isOperator(this.getLastOperation())) {

                        this.clearEntry()
                    }

                    else{

                        let numbersVet = []
                        numbersVet = this._numbersEl.textContent.split('')
                        numbersVet[numbersVet.length-1] = ""
                        this.setLastOperation(numbersVet.join(''))
                        this.setLastNumberToDisplay()
                    }

                    break;

                case "Escape":
                    this.clearEntry();
                    break;
    
                case "Enter":
                case "=":
                        this.calc()
                        this.playRamDam()
                        break;
    
                case "+":
                case "-":
                case "*":
                case "%":
                case "/":
                    this.addOperation(e.key)
                    break;
    
                case ".":
                    this.addDot(".")           
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))  ;
                    break;

                case "c":

                    if(e.ctrlKey) {

                        this.copy()

                    }
                    break;
    
            }

        })
    }

    initialize() {
        this.setLastNumberToDisplay()
    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false)

        })

    }

    clearEntry() {
        this._lastNumber = ''
        this._lastOperator = ''
        this._operation.pop()
        this.setLastNumberToDisplay()
        
    }

    clearAll() {

        this._lastNumber = ''
        this._lastOperator = ''
        this._operation = []
        this.setLastNumberToDisplay()


    }

    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1)
    }

    getLastOperation() {
        return this._operation[this._operation.length-1]
    }   

    setLastOperation(value) {
        this._operation[this._operation.length-1] = value
    }

    pushOperation(value) {
        this._operation.push(value)

        if (this._operation.length > 3) {

            this.calc()   
        }
    }

    getResult() {

        try {
            return eval(this._operation.join(""))
        } catch(e){

            setTimeout(() => {

                this._numbersEl.innerHTML = "ERRO!"  
                this._operation = []   
                
            }, 1);

               
            
        }
    }

    getLastItem(isOperator = true) {

        let lastItem 

        for (let i = this._operation.length - 1; i >= 0; i--) {
                
             if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i]
                break;
            }
        }

        if (!lastItem) {
            lastItem = this._lastOperator
        }

        return lastItem
    }

    calc() {

        let last = ''

        this._lastOperator = this.getLastItem()

        if (this._operation.length < 3) {

            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber]

        }
 
        if (this._operation.length > 3) {

            last = this._operation.pop()
            this._lastNumber = this.getResult()
            
        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false)
        }
        
        let result = this.getResult()

        if (last == "%") {

            result /= 100
            this._operation = [result]

        }

        else {

            this._operation = [result]
            
            if (last) this._operation.push(last)
        }

        this.setLastNumberToDisplay()
    }
    

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false)

         if(!lastNumber) lastNumber = 0

         this.numbers = lastNumber
    }

    addOperation(value) {


        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {  
                
                this.setLastOperation(value)
            }   

            else{
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }

        } 

        else{

            if (this.isOperator(value)) {
                
                this.pushOperation(value)
            }

            else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue)

                this.setLastNumberToDisplay()
            }
    
        }       
    
    }

    setError(){
        console.log("ERRO!")
    }

    addDot() {

        let lastOperation = this.getLastOperation()

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation("0.")
        } else {
            this.setLastOperation(lastOperation.toString() + ".")

        }

        this.setLastNumberToDisplay()

    }

    whichBtn(value) {


        switch (value) {

            case "AC":
                this.clearAll();
                break;

            case "CE":
                this.clearEntry();
                break;

            case "+":
                this.addOperation('+')
                break;

            case "-":
                this.addOperation('-')
                break;

            case "*":
                this.addOperation('*')
                break;

            case "%":
                this.addOperation("%")
                break;

            case "√":
                this.addOperation("√")
                break;

            case "/":
                this.addOperation("/")
                break;

            case "=":
                this.calc()
                this.playRamDam()
                break;

            case ".":
                this.addDot(".")           
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))  ;
                break;
        }
    }

    buttonEvents() {

        this._buttonsEl.forEach(btn => {

            this.addEventListenerAll(btn, 'click drag', e => {

                this._value = btn.className.replace("btn-","")
                
                this.playAudio()

                this.whichBtn(this._value)  

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", event => {

                btn.style.cursor = "pointer"

            })

        });
    }

    continuousDate() {

        setInterval(() => {

            this.setDataHour();

        }, 1000);
    }

    setDataHour() {

        this.hour = this.currentDate.toLocaleTimeString("pt-BR")
        this.data = this.currentDate.toLocaleDateString("pt-BR")
    }


    get numbers() {
        return this._numbersEl.innerHTML
    }

    set numbers(value) {

        if (value.toString().length > 10) {

            this._operation = []
            this._numbersEl.innerHTML = "ERROR!"
            return false;
        }
        this._numbersEl.innerHTML = value;
    }

    get currentDate() {
        return new Date;
    }

    set currentDate(value) {
        this._currentDate = value
    }

    get hour() {
        return this._hourEl.innerHTML
    }

    set hour(value) {
        return this._hourEl.innerHTML = value
    }

    get data() {
        return this._dataEl.innerHTML
    }

    set data(value) {
        return this._dataEl.innerHTML = value
    }

}

let calc = new Calculator(); 