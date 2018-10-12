var nums = new Array();
var score = 0;
var hasConflicted=new Array();//�Ѿ�����
$(function(){
    newgame();
});

//��ʼ����Ϸ
function newgame(){
  if(documentWidth>500){
    containerWidth=500;
    cellWidth=100;
    cellSpace=20;
  }else{
    //�����ƶ��˳ߴ�
    settingForMobile();
  }
  
	init();

  //�������������Ԫ������������
  generateOneNumber();
  generateOneNumber();
}
 
 function settingForMobile(){
  $('.new1').css('width',containerWidth);
  $('.container1').css('width',containerWidth-cellSpace*2);
  $('.container1').css('height',containerWidth-cellSpace*2);
  $('.container1').css('padding',cellSpace);
  $('.container1').css('border-radius',containerWidth*0.02);
  $('.zuida').css('width',containerWidth);
  $('.cell').css('width',cellWidth);
  $('.cell').css('height',cellWidth);
  $('.cell').css('border-radius',cellWidth*0.06);
 }

function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			// �²㵥Ԫ��
			var $cell = $('#cell-'+i+'-'+j);
			$cell.css('top',getTop(i,j));
			$cell.css('left',getLeft(i,j));

		}
	}
   //��ʼ������
   for(var i=0;i<4;i++){
   	 nums[i]=new Array();
     hasConflicted[i]=new Array();
   	 for(var j=0;j<4;j++){
   	 	nums[i][j]=0;
      hasConflicted[i][j]=false; //false��ʾδ�����ӹ���true��ʾ�Ѿ����ӹ�
   	 }
   }
     
     // nums[0][1]=8;
     // ��̬�����ϲ㵥Ԫ�񲢳�ʼ��
     updateCell();
     score=0;
     updateScore(score);



}

function updateCell(){
  // ����ϲ�
  $(".numcell").remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$(".container1").append('<div class="numcell" id="numcell-'+i+"-"+j+'"></div>');
            var numcell = $("#numcell-"+i+"-"+j);

            if(nums[i][j]==0){
            	numcell.css('width','0px');
            	numcell.css('height','0px');
            	numcell.css('top',getTop(i,j)+cellWidth*0.5);
            	numcell.css('left',getLeft(i,j)+cellWidth*0.5);
            }else{
            	numcell.css('width',cellWidth);
            	numcell.css('height',cellWidth);
            	numcell.css('top',getTop(i,j));
            	numcell.css('left',getLeft(i,j));
            	
              numcell.css('background-color',getNumberBackgroundColor(nums[i][j]));
            	numcell.css('color',getNumberColor(nums[i][j]));
              numcell.text(nums[i][j]);

        }
        hasConflicted[i][j]=false;

        //�ƶ��˳ߴ�
         $('.numcell').css('border-radius',cellWidth*0.06);
         $('.numcell').css('font-size',cellWidth*0.6);
         $('.numcell').css('line-height',cellWidth+'px');
         // $('.numcell').css('width',cellWidth+'px');
         $('.numcell').css('line-height',cellWidth+'px');

		}
	}
}

/*
  ������ĵ�Ԫ��������һ���������
  1.�ڿ���ĵ�Ԫ���������һ��
  2.�������һ��2��4
*/
function generateOneNumber(){
  //�ж��Ƿ��пռ䣬���û�пռ���ֱ�ӷ���
  if(noSpace(nums)){
    return;
  }
  //���һ��λ��
  var count=0;
  var temp=new Array();
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(nums[i][j]==0){
        temp[count] = i*4+j;
        count++;
      }
    }
  }
  var pos=Math.floor(Math.random()*count);  //[0,1) * 6 = [0,5]
  var randx=Math.floor(temp[pos]/4);
  var randy=Math.floor(temp[pos]%4);
  //���һ������
  var randNum=Math.random()<0.5?2:4;
  //�����λ������ʾ������� 
  nums[randx][randy]=randNum;
  showNumberWithAnimation(randx,randy,randNum);

}

$(document).keydown(function(event){
   event.preventDefault();
 // console.log(event);
   switch (event.keyCode) {
     case 37://��
       // �����ƶ�
       if(canLeft(nums)){
          moveLeft();
          setTimeout(generateOneNumber,200);
       }else if(!canMoveUp(nums)&&!canMoveRight(nums)&&!canMoveDown(nums)){
          
          alert("game over");
       }
       
       break;
     case 38://��
       // �����ƶ�
        if(canMoveUp(nums)){
        moveUp();
        setTimeout(generateOneNumber,200);
      }else if(!canLeft(nums)&&!canMoveRight(nums)&&!canMoveDown(nums)){
          alert("game over");
       }
      break;
      
      case 39://��
       // �����ƶ�
       if(canMoveRight(nums)){
        moveRight();
        setTimeout(generateOneNumber,200);
      }else if(!canLeft(nums)&&!canMoveUp(nums)&&!canMoveDown(nums)){
          alert("game over");
       }
       break;
      case 40://��
       // �����ƶ�
       if(canMoveDown(nums)){
        moveDown();
        setTimeout(generateOneNumber,200);
      }else if(!canLeft(nums)&&!canMoveUp(nums)&&!canMoveRight(nums)){
          alert("game over");
       }
       break; 
     default:
       
       break;
   }
});
//ʵ�ִ���������Ӧ
 document.addEventListener('touchstart',function(event){
  startx=event.touches[0].pageX;
  starty=event.touches[0].pageY;
});
 document.addEventListener('touchend',function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    //�жϻ�������
    var deltax=endx-startx;
    var deltay=endy-starty;

    //�жϵ���������С��һ������ֵʱ�����κβ���
    if(Math.abs(deltax)<documentWidth*0.08 && Math.abs(deltay)<documentWidth*0.08){
      return;
    }

    if(Math.abs(deltax)>=Math.abs(deltay)){ //ˮƽ�����ƶ�
      if(deltax>0){ //�����ƶ�
        if(canMoveRight(nums)){
          moveRight();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }else{ //�����ƶ�
        if(canLeft(nums)){
          moveLeft();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }
    }else{ //��ֱ�����ƶ�
      if(deltay>0){ //�����ƶ�
        if(canMoveDown(nums)){
          moveDown();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }else{ //�����ƶ�
        if(canMoveUp(nums)){
          moveUp();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }
    }

});


/*
  �����ƶ�
  ��Ҫ��ÿһ�����ֵ���߽����жϣ�ѡ����ŵ㣬��ŵ������������
    1.��ŵ�û�����֣������ƶ�·����û���ϰ���
    2.��ŵ����ֺ��Լ���ͬ�������ƶ�·����û���ϰ���
*/
function moveLeft(){
  console.log(111);
    for(var i=0;i<4;i++){
      for(var j=0;j<4;j++){
        if(nums[i][j]!=0){
          for(var k=0;k<j;k++){
            if(nums[i][k]==0 && noBlockHorizontal(i,k,j,nums)){
              //�ƶ�����
              showMoveAnimation(i,j,i,k);
              nums[i][k]=nums[i][j];
              nums[i][j]=0;
              break;
            } else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) && !hasConflicted[i][k]){
              showMoveAnimation(i,j,i,k);
              nums[i][k]+=nums[i][j];
              nums[i][j]=0;
              //ͳ�Ʒ���
              score+=nums[i][k];
              updateScore(score);

              hasConflicted[i][k]=true;//�Ѿ�����
              break;

            }
          }
        }
      }
    }
    setTimeout(updateCell,200); //�ȴ�200ms��Ϊ���õ�Ԫ���ƶ�Ч���ܹ���ʾ��
}

function moveRight(){
  console.log(111);
  for(var i=0;i<4;i++){
    for(var j=2;j>=0;j--){
      if(nums[i][j]!=0){
        for(var k=3;k>j;k--){
          if(nums[i][k]==0 && noBlockHorizontal(i,j,k,nums)){   //��i�еĵ�j-k��֮���Ƿ����ϰ���
            showMoveAnimation(i,j,i,k);
            nums[i][k]=nums[i][j];
            nums[i][j]=0;
            break;
          }else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,j,k,nums) && !hasConflicted[i][k]){
            showMoveAnimation(i,j,i,k);
            nums[i][k]+=nums[i][j];
            nums[i][j]=0;
            score+=nums[i][k];
            updateScore(score);

            hasConflicted[i][k]=true;
            break;
          }
        }
      } 
    }
  }
  setTimeout(updateCell,200); 
}
function moveUp(){
  for(var j=0;j<4;j++){
    for(var i=1;i<4;i++){
      if(nums[i][j]!=0){
        for(var k=0;k<i;k++){
          if(nums[k][j]==0 && noBlockVertical(j,k,i,nums)){ //��j�еĵ�k-i��֮���Ƿ����ϰ���
            showMoveAnimation(i,j,k,j);
            nums[k][j]=nums[i][j];
            nums[i][j]=0;
            break;
          }else if(nums[k][j]==nums[i][j] && noBlockVertical(j,k,i,nums) && !hasConflicted[k][j]){
            showMoveAnimation(i,j,k,j); 
            nums[k][j]+=nums[i][j];
            nums[i][j]=0;
            score+=nums[k][j];
            updateScore(score);

            hasConflicted[k][j]=true;
            break;
          }
        }
      }
    }
  }
  setTimeout(updateCell,200);
}

function moveDown(){
  for(var j=0;j<4;j++){
    for(var i=2;i>=0;i--){
      if(nums[i][j]!=0){
        for(var k=3;k>i;k--){
          if(nums[k][j]==0 && noBlockVertical(j,i,k,nums)){ //��j�еĵ�i-k��֮���Ƿ����ϰ���
            showMoveAnimation(i,j,k,j);
            nums[k][j]=nums[i][j];
            nums[i][j]=0;
            break;
          }else if(nums[k][j]==nums[i][j]  && noBlockVertical(j,i,k,nums) && !hasConflicted[k][j]){
            showMoveAnimation(i,j,k,j);
            nums[k][j]+=nums[i][j];
            nums[i][j]=0;
            score+=nums[k][j];
            updateScore(score);

            hasConflicted[k][j]=true;
            break;
          }
        } 
      }
    }
  }
  setTimeout(updateCell,200);
}
