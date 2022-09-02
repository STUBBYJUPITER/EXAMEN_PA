var horas,minutos,segundos;
horas=0;
minutos=0;
segundos=0;
hor=document.getElementById("horas");
min=document.getElementById("minutos");
seg=document.getElementById("segundos");
function tiempo(){
   var contador=0;
   window.setInterval(function(){
       if(contador<10){
           seg.innerHTML="0"+contador;
       }else{
           seg.innerHTML= contador;
       }
       if(contador>59){
           segundos=0;
           contador=0;
           minutos=minutos+1;
       }
       if(minutos>59){
           minutos=0;
           horas=horas+1;
       }
       if(horas>23){
           horas=0;

       }
       if(minutos<10){
           min.innerHTML="0"+minutos;
       }else{
           min.innerHTML=minutos;
       }
       if(horas<10){
           hor.innerHTML="0"+horas;
       }else{
           hor.innerHTML=horas;
       }
       contador++;
   },1000);
}
tiempo();
