// IndexController.prototype._registerServiceWorker = function() {
// 	if(!navigator.ServiceWorker) return;
// 	const IndexController = this;
// 	navigator.serviceWorker.register('restaSw.js').then(function(reg){
// 		if(!navigator.serviceWorker.controller){
// 			return;
// 		} if (reg.waiting){
// 			console.log("Im waiting for you");
// 			IndexController._updateReady();
// 			return;
// 		} if (reg.installing){
// 			console.log("yup yup, Im installing it")
// 			return;
// 		} reg.addEventListener('updatefound', function(){
// 			console.log("update found", sw.state);
// 			IndexController.trackInstalling(reg.installing);
// 			IndexController.prototype._trackInstalling = function(worker){
// 				var IndexController = this;
// 				worker.addEventListener('state Change', function(){
// 					if(worker.state ==='installed'){
// 						IndexController.updateReady();
// 					}
// 				})
// 			}
// 		})
// 	})
// }