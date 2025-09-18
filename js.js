document.addEventListener('DOMContentLoaded',function(){

   const teclado = document.querySelector('.comandos');   
   //const entrada = document.querySelector('.pantallaSuperior input');
   const entrada = document.querySelector('input[type="text"]');
   entrada.focus();
   let operacionesEntrada = [];   
   let i = -1;   
   let teclaSeleccionada = "";


   //Operaciones con click
   teclado.addEventListener('click', function(e){
        const seleccion = e.target.closest('.numeros, .operadores, [data-valor]');          
     
    
        if (seleccion){
            teclaSeleccionada = seleccion.dataset.valor || seleccion.textContent.trim();
            //desde aca

                // Verificar si se puede escribir SOLO para caracteres que agregan contenido
        if ((teclaSeleccionada >= 0 && teclaSeleccionada <= 9) || 
            (teclaSeleccionada === "x" || teclaSeleccionada === "+" || teclaSeleccionada === "-" 
                || teclaSeleccionada === "/" )){
            
            // Simular el carácter que se va a agregar para verificar tamaño
            let caracterAgregar = teclaSeleccionada;
            const valorOriginal = entrada.value;
            
            // Solo verificar si realmente se va a agregar algo
            let seVaAgregar = false;
            
            if (teclaSeleccionada >= 0 && teclaSeleccionada <= 9) {
                seVaAgregar = true;
                if (i == -1) {
                    entrada.value = caracterAgregar; // Reemplazar
                } else {
                    entrada.value += caracterAgregar; // Agregar
                }
            } else if ((teclaSeleccionada === "x" || teclaSeleccionada === "+" || teclaSeleccionada === "-" || teclaSeleccionada === "/") && i != -1) {
                if (!["*", "-", "/", "+"].includes(operacionesEntrada[i])) {
                    seVaAgregar = true;
                    entrada.value += caracterAgregar;
                }
            }
            
            if (seVaAgregar) {
                const puedeEscribir = evaluarTamano();
                entrada.value = valorOriginal; // Restaurar valor original
                
                if (!puedeEscribir) {
                    e.preventDefault();
                    entrada.focus();
                    return; // No permitir agregar más caracteres
                }
            }
        }

            //hasta aca
            if ((teclaSeleccionada === "x" || teclaSeleccionada === "+" || teclaSeleccionada === "-" || teclaSeleccionada ==="/") && i != -1){
            if (!["*", "-", "/", "+", ","].includes(operacionesEntrada[i])){
                entrada.value += teclaSeleccionada;
                i++;
                operacionesEntrada[i] = teclaSeleccionada === "x"?"*":teclaSeleccionada;
            }else{
                operacionesEntrada.pop();
                entrada.value = entrada.value.slice(0, -1);
                entrada.value += teclaSeleccionada;                
                operacionesEntrada[i] = teclaSeleccionada === "x"?"*":teclaSeleccionada;

            }            
        }
        
        if (["CE", "C"].includes(teclaSeleccionada)){
            entrada.value = 0;
            entrada.style.fontSize = "50px";
            i = -1;
            operacionesEntrada = [];            
        }


        if (teclaSeleccionada === "##"){
            e.preventDefault();
            if (entrada.value.length > 0){
                entrada.value = entrada.value.slice(0, -1);
                if (operacionesEntrada.length > 0) {
                    operacionesEntrada.pop();
                    i = operacionesEntrada.length - 1;
                }
            }

            if (entrada.value == ""){
                entrada.value = "0";
                i = -1;
                operacionesEntrada = [];
            }
            setTimeout(() => evaluarTamano(), 0);
            return;
        }   

        if (teclaSeleccionada === "="){
            const correcto = evaluarResultado(operacionesEntrada);
            entrada.value = correcto;
            operacionesEntrada = [];
            i = -1;
            entrada.style.fontSize = "50px";
            setTimeout(()=> evaluarTamano(),0);
        }
       

        if (teclaSeleccionada >=0 && teclaSeleccionada <=9){
            if (i != -1){
                entrada.value += teclaSeleccionada;
            }else{
                entrada.value = teclaSeleccionada;
            }
            i++;
            operacionesEntrada[i] = teclaSeleccionada;
            setTimeout(()=> evaluarTamano(),0);
        }     
        }
        entrada.focus();
    })
        
        
   //Operaciones con teclado
    entrada.addEventListener('keydown',function(e){    
        
        const tecla = e.key;      
        

        if (!/^[0-9]$/.test(tecla) &&  tecla!= "Backspace" && tecla != "ArrowLeft"
            && tecla != "ArrowRight" && tecla != "x" && tecla != "*" && tecla != "-"
            && tecla != "+" && tecla != "/"  && tecla != "Enter"){
            e.preventDefault();
            return;
        }
        //antes
        // Permitir navegación siempre
    if (["ArrowLeft", "ArrowRight"].includes(tecla)) {
        return; // No prevenir, permitir navegación
    }

    // Verificar si se puede escribir SOLO para caracteres que agregan contenido
    if (["+", "-", "*", "/", "."].includes(tecla) || /^[0-9]$/.test(tecla)) {
        // Simular el carácter que se va a agregar para verificar tamaño
        const valorTemp = entrada.value + (tecla === "*" ? "x" : tecla);
        const valorOriginal = entrada.value;
        
        entrada.value = valorTemp;
        const puedeEscribir = evaluarTamano();
        entrada.value = valorOriginal; // Restaurar valor original
        
        if (!puedeEscribir) {
            e.preventDefault();
            return; // No permitir agregar más caracteres
        }
    }
        //despues
        if (tecla == "Enter"){
            e.preventDefault();
            const correcto = evaluarResultado(operacionesEntrada);
            entrada.value = correcto;
            operacionesEntrada = [];
            i = -1;
            entrada.style.fontSize = "50px";
            setTimeout(()=> evaluarTamano(), 0);
            return;
        }
        if (/[0-9]/.test(tecla)){
            e.preventDefault();
            if (i != -1){
                entrada.value += tecla;
            }else{
                 entrada.value = tecla;
            }            
            i++;
            operacionesEntrada[i] = tecla;
            setTimeout(()=>evaluarTamano(),0);
            return;
        }
       
        if (tecla === "##"){
            e.preventDefault();
            if (entrada.value.length > 0){
                entrada.value = entrada.value.slice(0, -1);
                if (operacionesEntrada.length > 0) {
                    operacionesEntrada.pop();
                    i = operacionesEntrada.length - 1;
                }
            }

            if (entrada.value == ""){
                entrada.value = "0";
                i = -1;
                operacionesEntrada = [];
            }
            setTimeout(() => evaluarTamano(), 0);
            return;
        }     
        
        if ((/[+\-*/]/.test(tecla) && i != -1)){
            //let operador = tecla === "*"?"x": tecla;
            e.preventDefault();
            if (!["+", "-", "*", "/"].includes(operacionesEntrada[i])){
                let operador = tecla === "*"?"x": tecla;
                entrada.value += operador;
                i++;
                operacionesEntrada[i] = tecla;
                setTimeout(()=>evaluarTamano(),0);
            }else {
                operacionesEntrada.pop();
                entrada.value = entrada.value.slice(0, -1);
                let operador = tecla === "*"?"x": tecla;
                entrada.value += operador;                
                operacionesEntrada[i] = tecla;
                setTimeout(()=>evaluarTamano(),0);
            }
        }
    });    

    //Verifica si el ultimo caracter ingresado no es operador, evalua formato y opera
    function evaluarResultado(arreglo){        
        const evaluarUltimoElemento = arreglo[arreglo.length - 1];
        if (["+", "-", "*", "/"].includes(evaluarUltimoElemento)) arreglo.pop();
        let copiaArreglo = arreglo.join("");
        // Evalua formato correcto
        const evaluar = (/^[-+]?\d+(\.\d+)?([+\*\-/][-+]?\d+(\.\d+)?)*$/).test(copiaArreglo);       
        let deCadenaAArreglo = [];
        
        if (evaluar){
            //Tokeniza
            deCadenaAArreglo = copiaArreglo.split(/(?<=[\d\.])(?=[+\-*/])|(?<=[+\-*/])(?=[-]?\d)/);                
            for (let i = 0; i < deCadenaAArreglo.length-1; i++){
                if (deCadenaAArreglo[i] === "*" || deCadenaAArreglo[i] == "/"){
                    let operadorA = Number(deCadenaAArreglo[i-1]);
                    let operadorB = Number(deCadenaAArreglo[i+1]);
                    let resultado = deCadenaAArreglo[i] === "*"? operadorA * operadorB: operadorA/operadorB;
                    deCadenaAArreglo.splice(i-1 ,3, resultado.toString());
                    i -= 1;
                }     
            }

            for (let i = 0; i < deCadenaAArreglo.length-1; i++){
                if (deCadenaAArreglo[i] === "+" || deCadenaAArreglo[i] == "-"){
                    let operadorA = Number(deCadenaAArreglo[i-1]);
                    let operadorB = Number(deCadenaAArreglo[i+1]);
                    let resultado = deCadenaAArreglo[i] === "+"? operadorA + operadorB: operadorA-operadorB;
                    deCadenaAArreglo.splice(i-1 ,3, resultado.toString());
                    i -= 1;
                }     
            }

        }
        if (!Number.isInteger(Number(deCadenaAArreglo[0]))){
             return (Number(deCadenaAArreglo[0]).toFixed(7).replace(/\.?0+$/,''));
        }
        return (Number(deCadenaAArreglo[0]));
    } 
   

    function evaluarTamano(){
        const tamanoMinimo = 30;
        const tamanoinicio = 50;
        while (entrada.scrollWidth > entrada.offsetWidth){
            let tamano = parseFloat(getComputedStyle(entrada).fontSize);

            if (tamano > tamanoMinimo){                
                entrada.style.fontSize = (tamano - 2) + 'px';
                entrada.scrollLeft = entrada.scrollWidth;                
                //return true;
            }else{
                entrada.scrollLeft = entrada.scrollWidth - entrada.offsetWidth;                
                return false;
            }
        }
        
        if (entrada.scrollWidth <= entrada.offsetWidth){
            let tamanoActualS = parseFloat(getComputedStyle(entrada).fontSize);

            while(tamanoActualS < tamanoinicio){
                entrada.style.fontSize = (tamanoActualS + 2)+'px';
                if (entrada.scrollWidth > entrada.offsetWidth){
                    entrada.style.fontSize = (tamanoActualS) + 'px';
                    break;
                }
                tamanoActualS = parseFloat(getComputedStyle(entrada).fontSize);
            }
        }
        entrada.scrollLeft = entrada.scrollWidth;
        return true;
    } 

    entrada.addEventListener('input', () =>setTimeout(()=>evaluarTamano(),0));  // Cuando se escribe
    entrada.addEventListener('keyup', () =>setTimeout(()=>evaluarTamano(),0));
    entrada.addEventListener('change', () =>setTimeout(()=>evaluarTamano(),0));
    entrada.addEventListener('paste', () =>setTimeout(()=>evaluarTamano(),10));
});