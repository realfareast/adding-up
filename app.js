'use strict';
// 2010年から2015年にかけて15-19歳の人が増えた割合の都道府県ランキング

// 1. ファイルからデータを読み込む
const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });

// 2. 2010年と2015年のデータを選ぶ
const prefectureDataMap = new Map(); // key: 都道府県, value: 集計データのオブジェクト
rl.on('line', lineString => {
	const columns = lineString.split(',');
	const year = parseInt(columns[0]);
	const prefecture = columns[1];
	const population = parseInt(columns[3]);
	if (year === 2010 || year === 2015) {
		let aggregatedData = prefectureDataMap.get(prefecture);
		if (!aggregatedData) {
			aggregatedData = {
				population2010: 0,
				population2015: 0,
				change: null
			};
		}
		if (year === 2010) {
			aggregatedData.population2010 = population;
		}
		if (year === 2015) {
			aggregatedData.population2015 = population;
		}
		prefectureDataMap.set(prefecture, aggregatedData);

		console.log(year);
		console.log(prefecture);
		console.log(population);
		console.log(prefectureDataMap.get(prefecture));

	}
});

rl.on('close', () => {
	// 3. 都道府県ごとの変化率を計算する
	for (let [key, value] of prefectureDataMap) {
		value.change = value.population2015 / value.population2010;
	}

	// 4. 変化率ごとに並べる
	const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
		return pair2[1].change - pair1[1].change;
	});
	
	// 5. 並べられたものを表示する
	const rankingStrings = rankingArray.map(([key, value]) => {
		return (
			key + 
			': ' + 
			value.population2010 + 
			'=>' + 
			value.population2015 + 
			' 変化率:' + 
			value.change
		);
	});
	console.log(rankingStrings);
});

