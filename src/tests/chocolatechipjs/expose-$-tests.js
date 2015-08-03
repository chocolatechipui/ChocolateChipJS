module('Expose $ Tests');
// 1
test('chocolatechipjs should exist.', function() {
   equal($.isFunction(chocolatechipjs), true, 'chocolatechip should be true.');
});
// 2
test('Exposes the ChocolateChipJS $ to the global namespace.', function() {
   equal($, chocolatechipjs, '$ should equal chocolatechipjs')
});
// 3
test('Test name of $ (Should be ChocolateChip).', function() {
   equal($.libraryName, 'ChocolateChip', 'Should return "ChocolateChip"')
});