// Declarações do elementos usando o DOM (document object model)

const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

// funcao que vai habilitar a câmera

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video:{facingMode: "environment"}, //habilitar camera traseira
            audio: false
        })
        videoElemento.srcObject =  midia;
        videoElemento.play()
    }catch(erro){
        resultado.innerText="Erro ao acessar a camera", erro;
    }
}

configurarCamera();

//funcao para ler o texto da imagem e mostrar na tela

botaoScanear.onclick = async()=>{
    botaoScanear.disable = true;
    resultado.innerText = "Fazendo a leitura, aguarde"

    // chama a estrutura do canvas
    const context  = canvas.getContext("2d");

    //Ajusta o tamanho da tela 
    canvas.width = videoElemento.videowidth
    canvas.height = videoElemento.videoheight    


    // reset de qualquer transformacao dpara garantir que a foto nao fique invertida

    context.setTransform(1,0,1,0,0)

    // Aplica o filtro de contraste e escala de cinza no canvas antes de tirar a foto
    // (ajuda a evitar letras aleatorias)

    context.filter = 'contrast(1.2) grayscale(1)'

    context.drawImage(videoElemento,0,0, canvas.width,canvas.height);

    try{
        const {data: {text} } = await Tesseract.recognize(
            canvas,
            'por'
        );
        //remove espaços excessivos e caracters especiais
        const textoFinal = text.trim();

        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possivel identificar o texto";
    }catch(erro){
        console.error(erro);
        resultado.innerText="Erro ao processar", erro;
    }finally{
        botaoScanear.disable=false;
    }
}