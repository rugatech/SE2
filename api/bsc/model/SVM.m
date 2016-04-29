% written by: Tian Xie
% tested by: Tian Xie
% debugged by: Tian Xie

function SVM

% http://www.ilovematlab.cn/thread-47453-1-1.html

% Examples of options: -s 0 -c 10 -t 1 -g 1 -r 1 -d 3 
% Classify a binary data with polynomial kernel (u'v+1)^3 and C = 10
%   
% options:
% -s svm_type : set type of SVM (default 0)
% 	0 -- C-SVC
% 	1 -- nu-SVC
% 	2 -- one-class SVM
% 	3 -- epsilon-SVR
% 	4 -- nu-SVR
% -t kernel_type : set type of kernel function (default 2)
% 	0 -- linear: u'*v
% 	1 -- polynomial: (gamma*u'*v + coef0)^degree
% 	2 -- radial basis function: exp(-gamma*|u-v|^2)
% 	3 -- sigmoid: tanh(gamma*u'*v + coef0)
% -d degree : set degree in kernel function (default 3)
% -g gamma : set gamma in kernel function (default 1/num_features)
% -r coef0 : set coef0 in kernel function (default 0)
% -c cost : set the parameter C of C-SVC, epsilon-SVR, and nu-SVR (default 1)
% -n nu : set the parameter nu of nu-SVC, one-class SVM, and nu-SVR (default 0.5)
% -p epsilon : set the epsilon in loss function of epsilon-SVR (default 0.1)
% -m cachesize : set cache memory size in MB (default 100)
% -e epsilon : set tolerance of termination criterion (default 0.001)
% -h shrinking: whether to use the shrinking heuristics, 0 or 1 (default 1)
% -b probability_estimates: whether to train a SVC or SVR model for probability estimates, 0 or 1 (default 0)
% -wi weight: set the parameter C of class i to weight*C, for C-SVC (default 1)
% 
% The k in the -g option means the number of attributes in the input data.

close all;clc;

%data0=[36.16 36.07 36.48 36.66 37.31 37.16 36.50 36.52 36.33 37.84 5 5];

%data0=importdata('c:\Windows\Temp\ANN_input.txt').data;
data0=importdata('c:\Windows\Temp\ANN_input.txt');
pred_period=data0(length(data0)); 
data=data0(1:length(data0)-2);
day=data0(length(data0)-1); 
pred=zeros(1,pred_period);

s=length(data)-day-(pred_period-1);
input_train=zeros(s,day);
for ii=1:s
	input_train(ii,:)=data(ii:ii+day-1);
end
output_train=(data(day+pred_period:day+s+pred_period-1))';
model=svmtrain(output_train,input_train,'-s 3 -t 2 -c 2.2 -g 2.8 -p 0.01');

for iter=1:pred_period
	start=length(data)-day-(pred_period-1)+iter;
	finish=length(data)-(pred_period-1)-1+iter;
	input_test=data(start:finish);
	pred(iter)=svmpredict(mean(input_test),input_test,model);
end

fid=fopen('c:\Windows\Temp\ANN_output.txt','wt');
for num=1:length(pred)
	if num~=length(pred)
		fprintf(fid,'%0.2f ',pred(num));
	else
		fprintf(fid,'%0.2f',pred(num));
	end
end 
fclose(fid);
