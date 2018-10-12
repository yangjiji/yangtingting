var nums = new Array();
var score = 0;
var hasConflicted=new Array();//已经叠加
$(function(){
    newgame();
});

//开始新游戏
function newgame(){
  if(documentWidth>500){
    containerWidth=500;
    cellWidth=100;
    cellSpace=20;
  }else{
    //设置移动端尺寸
    settingForMobile();
  }
  
	init();

  //在随机的两个单元格中生成数字
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
			// 下层单元格
			var $cell = $('#cell-'+i+'-'+j);
			$cell.css('top',getTop(i,j));
			$cell.css('left',getLeft(i,j));

		}
	}
   //初始化数组
   for(var i=0;i<4;i++){
   	 nums[i]=new Array();
     hasConflicted[i]=new Array();
   	 for(var j=0;j<4;j++){
   	 	nums[i][j]=0;
      hasConflicted[i][j]=false; //false表示未曾叠加过，true表示已经叠加过
   	 }
   }
     
     // nums[0][1]=8;
     // 动态创建上层单元格并初始化
     updateCell();
     score=0;
     updateScore(score);



}

function updateCell(){
  // 清空上层
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

        //移动端尺寸
         $('.numcell').css('border-radius',cellWidth*0.06);
         $('.numcell').css('font-size',cellWidth*0.6);
         $('.numcell').css('line-height',cellWidth+'px');
         // $('.numcell').css('width',cellWidth+'px');
         $('.numcell').css('line-height',cellWidth+'px');

		}
	}
}

/*
  在随机的单元格中生成一个随机数：
  1.在空余的单元格中随机找一个
  2.随机产生一个2或4
*/
function generateOneNumber(){
  //判断是否还有空间，如果没有空间则直接返回
  if(noSpace(nums)){
    return;
  }
  //随机一个位置
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
  //随机一个数字
  var randNum=Math.random()<0.5?2:4;
  //在随机位置上显示随机数字 
  nums[randx][randy]=randNum;
  showNumberWithAnimation(randx,randy,randNum);

}

$(document).keydown(function(event){
   event.preventDefault();
 // console.log(event);
   switch (event.keyCode) {
     case 37://左
       // 向左移动
       if(canLeft(nums)){
          moveLeft();
          setTimeout(generateOneNumber,200);
       }else if(!canMoveUp(nums)&&!canMoveRight(nums)&&!canMoveDown(nums)){
          
          alert("game over");
       }
       
       break;
     case 38://上
       // 向上移动
        if(canMoveUp(nums)){
        moveUp();
        setTimeout(generateOneNumber,200);
      }else if(!canLeft(nums)&&!canMoveRight(nums)&&!canMoveDown(nums)){
          alert("game over");
       }
      break;
      
      case 39://右
       // 向右移动
       if(canMoveRight(nums)){
        moveRight();
        setTimeout(generateOneNumber,200);
      }else if(!canLeft(nums)&&!canMoveUp(nums)&&!canMoveDown(nums)){
          alert("game over");
       }
       break;
      case 40://下
       // 向下移动
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
//实现触摸滑动响应
 document.addEventListener('touchstart',function(event){
  startx=event.touches[0].pageX;
  starty=event.touches[0].pageY;
});
 document.addEventListener('touchend',function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    //判断滑动方向
    var deltax=endx-startx;
    var deltay=endy-starty;

    //判断当滑动距离小于一定的阈值时不做任何操作
    if(Math.abs(deltax)<documentWidth*0.08 && Math.abs(deltay)<documentWidth*0.08){
      return;
    }

    if(Math.abs(deltax)>=Math.abs(deltay)){ //水平方向移动
      if(deltax>0){ //向右移动
        if(canMoveRight(nums)){
          moveRight();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }else{ //向左移动
        if(canLeft(nums)){
          moveLeft();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }
    }else{ //垂直方向移动
      if(deltay>0){ //向下移动
        if(canMoveDown(nums)){
          moveDown();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }else{ //向上移动
        if(canMoveUp(nums)){
          moveUp();
          setTimeout(generateOneNumber,200);
          setTimeout(isGameOver,500);
        }
      }
    }

});


/*
  向左移动
  需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
    1.落脚点没有数字，并且移动路径中没有障碍物
    2.落脚点数字和自己相同，并且移动路径中没有障碍物
*/
function moveLeft(){
  console.log(111);
    for(var i=0;i<4;i++){
      for(var j=0;j<4;j++){
        if(nums[i][j]!=0){
          for(var k=0;k<j;k++){
            if(nums[i][k]==0 && noBlockHorizontal(i,k,j,nums)){
              //移动操作
              showMoveAnimation(i,j,i,k);
              nums[i][k]=nums[i][j];
              nums[i][j]=0;
              break;
            } else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) && !hasConflicted[i][k]){
              showMoveAnimation(i,j,i,k);
              nums[i][k]+=nums[i][j];
              nums[i][j]=0;
              //统计分数
              score+=nums[i][k];
              updateScore(score);

              hasConflicted[i][k]=true;//已经叠加
              break;

            }
          }
        }
      }
    }
    setTimeout(updateCell,200); //等待200ms，为了让单元格移动效果能够显示完
}

function moveRight(){
  console.log(111);
  for(var i=0;i<4;i++){
    for(var j=2;j>=0;j--){
      if(nums[i][j]!=0){
        for(var k=3;k>j;k--){
          if(nums[i][k]==0 && noBlockHorizontal(i,j,k,nums)){   //第i行的第j-k列之间是否有障碍物
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
          if(nums[k][j]==0 && noBlockVertical(j,k,i,nums)){ //第j列的第k-i行之间是否有障碍物
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
          if(nums[k][j]==0 && noBlockVertical(j,i,k,nums)){ //第j列的第i-k行之间是否有障碍物
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
