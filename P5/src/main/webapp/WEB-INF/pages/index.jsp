<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!doctype html>
<html>
<head>
    <link rel="stylesheet" href="/assets/css/index-bef6f806-1.css"/>
    <link rel="stylesheet" href="/assets/css/index-bef6f806-2.css"/>
</head>
<body>
<h2>Hello World by JSP!</h2>

<div id="app"></div>
<script src="../../bundle.js"></script>

<form action="/P5/upload" enctype="multipart/form-data">
    <input name="file" type="file">
    <button type="submit">上传</button>
</form>

</body>
</html>
