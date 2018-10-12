//通过动画显示数字
function showNumberWithAnimation(i,j,randNumber){
	console.log(j,j,randNumber);
	var numberCell=$('#numcell-'+i+'-'+j);
	numberCell.css('background-color', getNumberBackgroundColor(randNumber));
	numberCell.css('color', getNumberColor(randNumber));
	numberCell.text(randNumber);

	numberCell.animate({
		width:cellWidth,
		height:cellWidth,
		top:getTop(i,j),
		left:getLeft(i,j)
	}, 500);

}
//通过动画显示移动
function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell=$('#numcell-'+fromx+'-'+fromy);
	numberCell.animate({
      top:getTop(tox,toy),
	  left:getLeft(tox,toy)
	},200);
}