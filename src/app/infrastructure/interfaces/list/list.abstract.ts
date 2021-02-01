import {FormGroup} from "@angular/forms";
import {PaginationInfo} from "./data/pagination-info.model";
import {ListRS} from "./data/list-result-set.model";
import {getLang, Languages} from "../../data/enums/language.enum";
import {OrderInfo} from "./data/order-info.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {Utils} from "../../common/utils";
import {ExportTypes} from "./data/export-types.enum";
import {AuthActions} from "../../directives/authorization/data/auth-action.model";
import {OnInit} from "@angular/core";
import { LocalStorageService } from "../../services/LocalStorageService.service";
import { ConfigParam } from "../../data/dto/ConfigParam";


export abstract class AbstractList<U> implements OnInit {
  AUTH_ACTIONS: typeof AuthActions = AuthActions;
  EXPORT_TYPES: typeof ExportTypes = ExportTypes;
  LANG: typeof Languages = Languages;
  protected resultSet: ListRS<U> = new ListRS<U>();
  abstract filters: FormGroup;
  abstract orderInfo: OrderInfo;
  paginationInfo: PaginationInfo = new PaginationInfo();

  protected CURRENT_LANG: Languages;
  protected readonly DATE_FORMAT: string = ConfigParam.HTML_DISPLAY_DATE;

  protected constructor(protected pageTitle: string, protected translate: TranslateService,
                        protected localStorageService: LocalStorageService,
                        protected titleService: Title,
                        protected activatedRoute: ActivatedRoute,
                        protected router: Router) {
    this.translate.get(pageTitle).subscribe(res => this.titleService.setTitle(res));
    this.translate.onLangChange.subscribe(lang => {
      this.translate.get(pageTitle).subscribe(res => this.titleService.setTitle(res));
      this.CURRENT_LANG = getLang(lang);
    });
    this.CURRENT_LANG = this.localStorageService.getCurrentLanguage();
  }

  onRouteChange() {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (queryParams.pageNum == null || queryParams.pageSize == null || queryParams.orderBy == null) {
      queryParams[PaginationInfo.PAGE_NUM_QUERY] = +this.paginationInfo.pageNumber;
      queryParams[PaginationInfo.PAGE_SIZE_QUERY] = this.paginationInfo.pageSize;
      queryParams[OrderInfo.ORDER_BY_QUERY] = this.orderInfo.orderBy;
      queryParams[OrderInfo.ORDER_DIR_QUERY] = this.orderInfo.orderDir;
      this.router.navigate([window.location.pathname], {queryParams: queryParams});
    }
    //this.activatedRoute.queryParams.startWith(queryParams).distinctUntilChanged().subscribe
    this.activatedRoute.queryParams.subscribe(changes => {
      if (Utils.hasValueAndIsNumber(changes.pageSize))
        this.paginationInfo.pageSize = parseInt(changes.pageSize);
      if (Utils.hasValueAndIsNumber(changes.pageNum)) {
        this.paginationInfo.pageNumber = parseInt(changes.pageNum);
        this.paginationInfo.offset = this.paginationInfo.pageNumber * this.paginationInfo.pageSize;
      }
      if (Utils.hasValue(changes.orderBy))
        this.orderInfo.orderBy = changes.orderBy;
      if (Utils.hasValue(changes.orderDir))
        this.orderInfo.orderDir = changes.orderDir;

      this.loadQueryParametersIntoForm(changes);
      this.findAll();
    });
  }

  protected onChangePage(pageNum: number) {
    this.paginationInfo.pageNumber = pageNum;
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams[PaginationInfo.PAGE_NUM_QUERY] = pageNum.toString();
    this.router.navigate([window.location.pathname], {queryParams: queryParams});
  }

  protected onChangePageSize() {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams[PaginationInfo.PAGE_NUM_QUERY] = '0';
    queryParams[PaginationInfo.PAGE_SIZE_QUERY] = this.paginationInfo.pageSize;
    this.router.navigate([window.location.pathname], {queryParams: queryParams});
  }

  protected onClear() {
    this.filters.reset();
    this.onSearch();
  }

  protected onOrder(orderBy: string) {

    //console.log("HELLOOOOOOOOOOOOOOOOOO");
    this.orderInfo.orderBy = orderBy;
    if (this.orderInfo.orderBy == orderBy && this.orderInfo.orderDir == 'asc')
      this.orderInfo.orderDir = 'desc';
    else if (this.orderInfo.orderBy == orderBy)
      this.orderInfo.orderDir = 'asc';
    else
      this.orderInfo.orderDir = 'desc';

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams[OrderInfo.ORDER_BY_QUERY] = this.orderInfo.orderBy;
    queryParams[OrderInfo.ORDER_DIR_QUERY] = this.orderInfo.orderDir;
    queryParams[PaginationInfo.PAGE_NUM_QUERY] = 0;
    this.router.navigate([window.location.pathname], {queryParams: queryParams});
  }

  protected onOrderAdvanced() {

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams[OrderInfo.ORDER_BY_QUERY] = this.orderInfo.orderBy;
    queryParams[OrderInfo.ORDER_DIR_QUERY] = this.orderInfo.orderDir;
    queryParams[PaginationInfo.PAGE_NUM_QUERY] = 0;
    this.router.navigate([window.location.pathname], {queryParams: queryParams});
  }

  protected onOrderChanged() {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams[OrderInfo.ORDER_BY_QUERY] = this.orderInfo.orderBy;
    queryParams[OrderInfo.ORDER_DIR_QUERY] = this.orderInfo.orderDir;
    queryParams[PaginationInfo.PAGE_NUM_QUERY] = 0;
    this.router.navigate([window.location.pathname], {queryParams: queryParams});
  }

  onSearch() {

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    this.loadFromDataIntoQueryParameters(queryParams);
    queryParams[PaginationInfo.PAGE_NUM_QUERY] = 0;
    this.router.navigate([window.location.pathname], {queryParams: queryParams});
  }

  abstract loadFromDataIntoQueryParameters(queryParams: Params);

  abstract loadQueryParametersIntoForm(changes);

  abstract initializeFilters();

  abstract findAll();

  ngOnInit(): void {
    this.onRouteChange();
    this.initializeFilters();
  }

}
