define(['app'], function (app) {
	app.factory('pn.message', [function () {
		// TODO Expand This
		var service = {

                   confirm: 'تایید',
					deleteSure: 'آیا نسبت به حذف این آیتم اطمینان دارید؟',
					successfullDelete: "حذف اطلاعات با موفقیت انجام شد",
					deleteItem: "حذف آیتم",
					errorInsert: "اطلاعات برای ثبت وجود ندارد",
					errorUpdate: "اطلاعاتی برای ویرایش وجود ندارد",
					errorDelete: "اطلاعات برای حذف وجود ندارد",
					errorRepeat: "اطلاعات مورد نظر تکراری است",
					error: "خطا",
					successfullInsert: "اطلاعات با موفقیت ثبت شدند",
					SuccessfullUpdate: "اطلاعات با موفقیت ویرایش شدند",
					SuccessfullDelete: "اطلاعات برای موفقیت حذف شدند",
					notFoundApplyData: "عملیاتی برای ثبت یافت نشد",
					insert: "ثبت اطلاعات",
					update: "ویرایش اطلاعات",
					delete: "حذف اطلاعات",
					note: "توجه",
					noSelectedGoodItemForDelete: "آیتم مناسبی برای حذف انتخاب شده است",
					yes: "بله",
					no:"خیر",
					noSelectedUser: "کاربر به درستی انتخاب نشد است",
					noSelectedRole: "نقشی به درستی انتخاب نشد است",
                     role: 'نقش',
			    groupRole: 'گروه نقش',
			    noSelectedRole: "نقشی به درستی انتخاب نشد است",
			    roleOrGroupRolePorperties: "مشخصات گروه و نقش",
			    groupRolePorperties: "مشخصات گروه",
			    rolePorperties: "مشخصات نقش",
			    rootRoleAndGroupRole: "درختواره گروه و نقش",
			    noExistsPersonWithId: "شخصی با شماره پرسنل وارد شده موجود نمی باشد",
			common:
				{
                    confirm: 'تایید',
					deleteSure: 'آیا نسبت به حذف این آیتم اطمینان دارید؟',
					successfullDelete: "حذف اطلاعات با موفقیت انجام شد",
					deleteItem: "حذف آیتم",
					errorInsert: "اطلاعات برای ثبت وجود ندارد",
					errorUpdate: "اطلاعاتی برای ویرایش وجود ندارد",
					errorDelete: "اطلاعات برای حذف وجود ندارد",
					errorRepeat: "اطلاعات مورد نظز تکراری است",
					error: "خطا",
					successfullInsert: "اطلاعات با موفقیت ثبت شدند",
					SuccessfullUpdate: "اطلاعات با موفقیت ویرایش شدند",
					SuccessfullDelete: "اطلاعات برای موفقیت حذف شدند",
					notFoundApplyData: "عملیاتی برای ثبت یافت نشد",
					insert: "ثبت اطلاعات",
					update: "ویرایش اطلاعات",
					delete: "حذف اطلاعات",
					note: "توجه",
					noSelectedGoodItemForDelete: "آیتم مناسبی برای حذف انتخاب شده است",
					yes: "بله",
					no:"خیر",
					noSelectedUser: "کاربر به درستی انتخاب نشد است",
					noSelectedRole: "نقشی به درستی انتخاب نشد است",
				},
			um: {
			    role: 'نقش',
			    groupRole: 'گروه نقش',
			    noSelectedRole: "نقشی به درستی انتخاب نشد است",
			    roleOrGroupRolePorperties: "مشخصات گروه و نقش",
			    groupRolePorperties: "مشخصات گروه",
			    rolePorperties: "مشخصات نقش",
			    rootRoleAndGroupRole: "درختواره گروه و نقش",
			    noExistsPersonWithId: "شخصی با شماره پرسنل وارد شده موجود نمی باشد"
			}
		};

		return service;
	}
	]);
});