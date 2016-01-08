'use strict';

$(document).ready(init);

var contList;

function init() {
	$('#save').click(saveClicked);
	$('#clear').click(clearClicked);
	$('tbody').on('dblclick','td',fieldClicked);
	$('tbody').on('blur','td',lostFocus);
	$('tbody').on('click','i',delClicked);
	$('th').click(sortClicked);

	contList = JSON.parse(localStorage.names || "[]") || [];
	updateListToDOM();
}

function updateListToDOM() { //from contList
	$('.table').find('tbody').empty();

	contList.forEach(function(arr){
		addRowToDOM(arr[0],arr[1],arr[2],arr[3],arr[4]);
	});
}

function addRowToDOM(name,email,phone,addr,group) {
	var $row = $('<tr>');

	var $tableChk = $('<td>');

	var $del = $('<i>');
	$del.addClass('glyphicon-trash').addClass('glyphicon').addClass('clickable');
	$tableChk.append($del);
	
	var $tdata1 = $('<td>').text(name);	
	var $tdata2 = $('<td>').text(email);
	var $tdata3 = $('<td>').text(phone);	
	var $tdata4 = $('<td>').text(addr);
	var $tdata5 = $('<td>').text(group);

	$row.append($tableChk,$tdata1,$tdata2,$tdata3,$tdata4,$tdata5);

	$('.table').find('tbody').append($row);
}

function sortClicked(e) {
	var $th = $(e.target).closest('th');
	var col = $th.index();
	if (col!=0) {
		var $icon = $('<i>').addClass('glyphicon');

		if ($th.find('i').hasClass('glyphicon-triangle-bottom')) {
			//wipe all icons
			$('th').find('i').each(function(i,el){
				$(el).remove();
			});
			//add opposite icon
			$icon.addClass('glyphicon-triangle-top');
			//pass to sort -> column#, direction to sort
			//call array.sort(col,direction)
			//DOM col is not equal to array index
			//array_index = col - 1
			contList.reverse();		//already sorted, so just reverse	
		}
		else if ($th.find('i').hasClass('glyphicon-triangle-top')) {
			$('th').find('i').each(function(i,el){
				$(el).remove();
			});
			$icon.addClass('glyphicon-triangle-bottom');
			contList.reverse();
		}
		else {
			$('th').find('i').each(function(i,el){
				$(el).remove();
			});
			$icon.addClass('glyphicon-triangle-top');

			contList.sort(function(a,b){
				var A = a[col-1].toLowerCase();
				var B = b[col-1].toLowerCase();
				return A.charCodeAt(0) - B.charCodeAt(0);
			});
		}
		$th.append($icon);
		updateListToDOM();
	}
}

function saveClicked() {
	var input = [];
	var name = $('#name').val();
	var email = $('#email').val();
	var phone = $('#phone').val();
	var addr = $('#addr').val();
	var group = $('#group').val();
	input.push(name);
	input.push(email);
	input.push(phone);
	input.push(addr);
	input.push(group);
	
	contList.push(input);
  localStorage.names = JSON.stringify(contList);

  updateListToDOM();
}

function clearClicked() {
	var $allInput = $('.inputPanel > input');
	$allInput.each(function(i,el){
		$(el).val('');
	});
	$allInput.filter(':first').focus();
}

function fieldClicked(e) {
	var $field = $(e.target);
	if ($field.index()!=0) {
		var tdValue = $field.text();
		var $inputBox = $('<input>').attr('type','text');
		$inputBox.val(tdValue);
		$field.text('');
		$field.append($inputBox);
		$inputBox.focus();
	}
}

function lostFocus(e) {
	var $field = $(e.target);
	var $td = $field.closest('td');
	if ($td.index()!=0) {	//if it's not the 1st td in tr
		$td.empty();
		$td.text($field.val());

		contList = JSON.parse(localStorage.names);	
		contList[$td.closest('tr').index()][$td.index()-1] = $td.text();
		localStorage.names = JSON.stringify(contList);
	}
}

function delClicked(e) {
	var $field = $(e.target);
	var $tr = $field.closest('tr');

	contList = JSON.parse(localStorage.names);	
	contList.splice($tr.index(),1);
	localStorage.names = JSON.stringify(contList);

	updateListToDOM();
}