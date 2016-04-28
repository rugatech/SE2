% written by: Tian Xie
% tested by: Tian Xie
% debugged by: Tian Xie

function BCF

close all;clc;

% data0=[36.16 36.07 36.48 36.66 37.31 37.16 36.50 36.52 36.33 37.84 0.05 11.1 2];

% data0=importdata('BCF_input.txt');
data0=importdata('c:\Windows\Temp\ANN_input.txt');
pred_period=data0(length(data0));
data=data0(1:length(data0)-3);
a=data0(length(data0)-2);
b=data0(length(data0)-1);
pred=zeros(1,pred_period);

n=length(data);
x=0.1:0.1:0.1*n;
t=data;
pred_data=0.1*(n+1):0.1:0.1*(n+pred_period);

for iter=1:pred_period

	new_data=pred_data(iter);

	% S^(-1)

	a1=(new_data.^(0:n-1))';
	
	b1=zeros(n,n);
	temp1=zeros(n,1);	
	for ii=1:n
		temp1=(x(ii).^(0:n-1))';
		b1=b1+temp1*a1';
	end

	c1=diag(ones(1,n));
	S=inv(c1*a+b1*b);

	% [s(x)]^2

	a2=(new_data.^(0:n-1))';
	v=1/b+a2'*S*a2;

	% m(x)

	a3=(new_data.^(0:n-1))';

	b3=zeros(n,1);
	temp2=zeros(n,1);
	for ii=1:n
		temp2=(x(ii).^(0:n-1))';
		b3=b3+temp2*t(:,ii);
	end

	m=a3'*b*S*b3;

	pred(iter)=m;
end

% fid=fopen('BCF_output.txt','wt');
fid=fopen('c:\Windows\Temp\ANN_output.txt','wt');
for num=1:length(pred)
	if num~=length(pred)
		fprintf(fid,'%0.2f ',pred(num));
	else
		fprintf(fid,'%0.2f',pred(num));
	end
end 
fclose(fid);
