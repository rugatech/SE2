% written by: Tian Xie
% tested by: Tian Xie
% debugged by: Tian Xie

% http://blog.sina.com.cn/s/blog_64b046c70101cko4.html
% http://blog.csdn.net/sbtdkj1017/article/details/1901663

function ANN

close all;clc;

% data0=[36.16 36.07 36.48 36.66 37.31 37.16 36.50 36.52 36.33 37.84 5 2];

% data0=importdata('ANN_input.txt');
data0=importdata('c:\Windows\Temp\ANN_input.txt');
pred_period=data0(length(data0));
data=data0(1:length(data0)-2);
day=data0(length(data0)-1);
pred=zeros(1,pred_period);

s=length(data)-day-(pred_period-1);
input_train=zeros(day,s);
for ii=1:s
	input_train(:,ii)=data(ii:ii+day-1);
end
output_train=data(day+pred_period:day+s+pred_period-1);

[inputn_train,inputps]=mapminmax(input_train);

net=newff(inputn_train,output_train,ceil(sqrt(day))); 

inputWeights=net.iw{1,1};
inputBias=net.b{1};
hiddenWeights=net.lw{2,1};
hiddenBias=net.b{2};

net.trainParam.show=NaN;
net.trainParam.lr=0.1; 
net.trainParam.mc=0.9;
net.trainParam.epochs=5000;
net.trainParam.goal=0.001;

[net,tr]=train(net,inputn_train,output_train);

for iter=1:pred_period
	start=length(data)-day-(pred_period-1)+iter;
	finish=length(data)-(pred_period-1)-1+iter;
    input_test=data(start:finish)';
    inputn_test=mapminmax('apply',input_test,inputps);
    pred(iter)=sim(net,inputn_test);
end

% fid=fopen('ANN_output.txt','wt');
fid=fopen('c:\Windows\Temp\ANN_output.txt','wt');
for num=1:length(pred)
	if num~=length(pred)
		fprintf(fid,'%0.2f ',pred(num));
	else
		fprintf(fid,'%0.2f',pred(num));
	end
end 
fclose(fid)

