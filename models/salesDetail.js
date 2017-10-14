module.exports = function (sequilize, DataTypes) {
	return sequilize.define('salesDetail', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 25]
			}
		},
		plu: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 5]
			}
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 50]
			}
		},
		qty: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 8]
			}
		},
		amount: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 8]
			}
		},
		discount: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 8]
			}
		},
		line_total: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 8]
			}
		},
		taxable: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	});
};