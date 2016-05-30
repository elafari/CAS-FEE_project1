/**
 * Client functions for project 1.
 *
 * @version 1.0
 *
 */

var cas = cas || {};
cas.fee = cas.fee || {};
cas.fee.helper = {
	
	/**
  * Filter array by given filter criteria
	* @param {Object} data Array which has to be filtered
	* @param {String} filterCriteria Array attribute to filter 
  * @return {Object} Filtered array
  */
	filterArray: function(data, filterCriteria) {
		try {
			var dataFiltered = $.grep(data, function(element, index){
					return element[filterCriteria] != "";
			});
			return dataFiltered;
		} catch(e) {
			return data;
		}
	},

	/**
  * Sort array by given sort criteria
	* @param {Object} data Array which has to be sorted
	* @param {String} sortCriteria Array attribute to sort by 
	* @param {Boolean} sortOrder true=asc, false=desc
  * @return {Object} Sorted array
  */	
	sortArray: function(data,sortCriteria,sortOrder,sortType) {
		try {
			var sort_by = function(field, reverse, primer){
				 var key = function (x) {return primer ? primer(x[field]) : x[field]};

				 return function (a,b) {
					var A = key(a), B = key(b);
					return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];                  
				 }
			}
			data.sort(sort_by(sortCriteria,sortOrder,parseInt));
			return data;
		} catch(e) {
			return data;
		}
	}
	
}
